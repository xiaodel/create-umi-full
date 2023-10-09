import {
  BaseGenerator,
  chalk,
  clackPrompts,
  execa,
  fsExtra,
  getGitInfo,
  installWithNpmClient,
  logger,
  pkgUp,
  tryPaths,
  yParser,
} from '@umijs/utils';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { ERegistry, unpackTemplate, type UmiTemplate } from './template';

interface ITemplateArgs {
  template?: UmiTemplate;
}

interface IArgs extends yParser.Arguments, ITemplateArgs {
  default?: boolean;
  git?: boolean;
  install?: boolean;
}

interface IContext {
  projectRoot: string;
  inMonorepo: boolean;
  target: string;
}

interface ITemplatePluginParams {
  pluginName?: string;
}

interface ITemplateParams extends ITemplatePluginParams {
  version: string;
  npmClient: ENpmClient;
  registry: string;
  author: string;
  email: string;
  withHusky: boolean;
  extraNpmrc: string;
}

enum ENpmClient {
  npm = 'npm',
  cnpm = 'cnpm',
  tnpm = 'tnpm',
  yarn = 'yarn',
  pnpm = 'pnpm',
}

enum ETemplate {
  app = 'app',
  max = 'max',
  vueApp = 'vue-app',
  plugin = 'plugin',
}

export interface IDefaultData extends ITemplateParams {
  appTemplate?: ETemplate;
}

const pkg = require('../package');
const DEFAULT_DATA = {
  pluginName: 'umi-plugin-demo',
  email: '1580043700@qq.com',
  author: 'umijs & 1580043700@qq.com',
  version: pkg.version,
  npmClient: ENpmClient.pnpm,
  registry: ERegistry.npm,
  withHusky: false,
  extraNpmrc: '',
  appTemplate: ETemplate.app,
} satisfies IDefaultData;

interface IGeneratorOpts {
  cwd: string;
  args: IArgs;
  defaultData?: IDefaultData;
}

export default async ({
  cwd,
  args,
  defaultData = DEFAULT_DATA,
}: IGeneratorOpts) => {
  let [name] = args._;
  let npmClient = ENpmClient.pnpm;
  let registry = ERegistry.npm;
  let appTemplate = defaultData?.appTemplate || ETemplate.app;
  const { username, email } = await getGitInfo();
  const author = email && username ? `${username} <${email}>` : '';

  // plugin params
  let pluginName = `umi-plugin-${name || 'demo'}`;

  const target = name ? join(cwd, name) : cwd;

  const { isCancel, text, select, intro, outro } = clackPrompts;
  const exitPrompt = () => {
    outro(chalk.red('Exit create-umi-full'));
    process.exit(1);
  };
  const selectAppTemplate = async () => {
    appTemplate = (await select({
      message: '选择 Umi 应用模板',
      options: [
        // { label: 'Simple App', value: ETemplate.app },
        {
          label: 'Ant Design Pro',
          value: ETemplate.max,
          hint: '更多的插件和准备使用的功能',
        },
        // { label: 'Vue Simple App', value: ETemplate.vueApp },
        // {
        //   label: 'Umi Plugin',
        //   value: ETemplate.plugin,
        //   hint: 'for plugin development',
        // },
      ],
      initialValue: ETemplate.max,
    })) as ETemplate;
  };
  const selectNpmClient = async () => {
    npmClient = (await select({
      message: '选择 Npm 工具',
      options: [
        { label: ENpmClient.npm, value: ENpmClient.npm },
        { label: ENpmClient.cnpm, value: ENpmClient.cnpm },
        { label: ENpmClient.tnpm, value: ENpmClient.tnpm },
        { label: ENpmClient.yarn, value: ENpmClient.yarn },
        { label: ENpmClient.pnpm, value: ENpmClient.pnpm, hint: 'recommended' },
      ],
      initialValue: ENpmClient.pnpm,
    })) as ENpmClient;
  };
  const selectRegistry = async () => {
    registry = (await select({
      message: '选择 Npm 仓库',
      options: [
        {
          label: 'npm',
          value: ERegistry.npm,
          hint: 'npm官方仓库',
        },
        {
          label: 'taobao',
          value: ERegistry.taobao,
          hint: '淘宝仓库',
        },
      ],
      initialValue: ERegistry.npm,
    })) as ERegistry;
  };
  const internalTemplatePrompts = async () => {
    intro(chalk.bgHex('#19BDD2')(' create-umi-full '));

    await selectAppTemplate();
    if (isCancel(appTemplate)) {
      exitPrompt();
    }

    await selectNpmClient();
    if (isCancel(npmClient)) {
      exitPrompt();
    }

    await selectRegistry();
    if (isCancel(registry)) {
      exitPrompt();
    }

    // plugin extra questions
    const isPlugin = appTemplate === ETemplate.plugin;
    if (isPlugin) {
      pluginName = (await text({
        message: `What's the plugin name?`,
        placeholder: pluginName,
        validate: (value) => {
          if (!value?.length) {
            return 'Please input plugin name';
          }
        },
      })) as string;
      if (isCancel(pluginName)) {
        exitPrompt();
      }
    }

    outro(chalk.green(`You're all set!`));
  };

  // --default
  const useDefaultData = !!args.default;
  // --template
  const useExternalTemplate = !!args.template;

  switch (true) {
    case useExternalTemplate:
      await selectNpmClient();
      if (isCancel(npmClient)) {
        exitPrompt();
      }
      await selectRegistry();
      if (isCancel(registry)) {
        exitPrompt();
      }
      await unpackTemplate({
        template: args.template!,
        dest: target,
        registry,
      });
      break;
    // TODO: init template from git
    // case: useGitTemplate
    default:
      if (!useDefaultData) {
        await internalTemplatePrompts();
      }
  }

  const version = pkg.version;

  // detect monorepo
  const monorepoRoot = await detectMonorepoRoot({ target });
  const inMonorepo = !!monorepoRoot;
  const projectRoot = inMonorepo ? monorepoRoot : target;

  // git
  const shouldInitGit = args.git !== false;
  // now husky is not supported in monorepo
  const withHusky = shouldInitGit && !inMonorepo;

  // pnpm
  let pnpmExtraNpmrc: string = '';
  const isPnpm = npmClient === ENpmClient.pnpm;
  let pnpmMajorVersion: number | undefined;
  if (isPnpm) {
    pnpmMajorVersion = await getPnpmMajorVersion();
    if (pnpmMajorVersion === 7) {
      // suppress pnpm v7 warning ( 7.0.0 < pnpm < 7.13.5 )
      // https://pnpm.io/npmrc#strict-peer-dependencies
      pnpmExtraNpmrc = `strict-peer-dependencies=false`;
    }
  }

  const injectInternalTemplateFiles = async () => {
    const generator = new BaseGenerator({
      path: join(__dirname, '..', 'templates', appTemplate),
      target,
      slient: true,
      data: useDefaultData
        ? defaultData
        : ({
            version: version.includes('-canary.') ? version : `^${version}`,
            npmClient,
            registry,
            author,
            email,
            withHusky,
            extraNpmrc: isPnpm ? pnpmExtraNpmrc : '',
            pluginName,
          } satisfies ITemplateParams),
    });
    await generator.run();
  };
  if (!useExternalTemplate) {
    await injectInternalTemplateFiles();
  }

  const context: IContext = {
    inMonorepo,
    target,
    projectRoot,
  };

  if (!withHusky) {
    await removeHusky(context);
  }

  if (inMonorepo) {
    // monorepo should move .npmrc to root
    await moveNpmrc(context);
  }

  // init git
  if (shouldInitGit) {
    await initGit(context);
  } else {
    logger.info(`Skip Git init`);
  }

  // install deps
  const isPnpm8 = pnpmMajorVersion === 8;
  if (!useDefaultData && args.install !== false) {
    if (isPnpm8) {
      await installWithPnpm8(target);
    } else {
      installWithNpmClient({ npmClient, cwd: target });
    }
  } else {
    logger.info(`跳过安装步骤`);
    if (isPnpm8) {
      logger.warn(
        chalk.yellow(
          `你现在使用的是pnpm v8，它会安装最小版本的依赖`,
        ),
      );
      logger.warn(
        chalk.green(
          `建议你执行 ${chalk.bold.cyan(
            'pnpm up -L',
          )} 安装最新版本的依赖项`,
        ),
      );
    }
  }
};

async function detectMonorepoRoot(opts: {
  target: string;
}): Promise<string | null> {
  const { target } = opts;
  const rootPkg = await pkgUp.pkgUp({ cwd: dirname(target) });
  if (!rootPkg) {
    return null;
  }
  const rootDir = dirname(rootPkg);
  if (
    tryPaths([
      join(rootDir, 'lerna.json'),
      join(rootDir, 'pnpm-workspace.yaml'),
    ])
  ) {
    return rootDir;
  }
  return null;
}

async function moveNpmrc(opts: IContext) {
  const { target, projectRoot } = opts;
  const sourceNpmrc = join(target, './.npmrc');
  const targetNpmrc = join(projectRoot, './.npmrc');
  if (!existsSync(targetNpmrc)) {
    await fsExtra.copyFile(sourceNpmrc, targetNpmrc);
  }
  await fsExtra.remove(sourceNpmrc);
}

async function initGit(opts: IContext) {
  const { projectRoot } = opts;
  const isGit = existsSync(join(projectRoot, '.git'));
  if (isGit) return;
  try {
    await execa.execa('git', ['init'], { cwd: projectRoot });
  } catch {
    logger.error(`初始化git回购失败`);
  }
}

async function removeHusky(opts: IContext) {
  const dir = join(opts.target, './.husky');
  if (existsSync(dir)) {
    await fsExtra.remove(dir);
  }
}

// pnpm v8 will install minimal version of the dependencies
// so we upgrade all deps to the latest version
// https://pnpm.io/npmrc#resolution-mode
async function installWithPnpm8(cwd: string) {
  await execa.execa('pnpm', ['up', '-L'], { cwd, stdio: 'inherit' });
}

async function getPnpmMajorVersion() {
  try {
    const { stdout } = await execa.execa('pnpm', ['--version']);
    return parseInt(stdout.trim().split('.')[0], 10);
  } catch (e) {
    throw new Error('请先安装 pnpm', { cause: e });
  }
}
