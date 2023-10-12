import React, {useMemo, useState} from 'react';

export * from "antd";
import Draggable from 'react-draggable';
import {Modal as AntdModal} from "antd";
import type {ModalProps} from "antd";

type IProps = {
    trigger?: JSX.Element;
    draggable?: boolean;
    onFinish?: () => Promise<any>;
} & ModalProps

/**
 * description: 标题处可拖拽;在 Modal 的基础上增加了 trigger ，无需维护 open 状态
 * author:
 * create_date:
 */
const Modal = (props: IProps) => {

    const {draggable: propsDraggable = true, trigger} = props;
    let [open, setOpen] = useState<boolean>(false);
    let [loading, setLoading] = useState<boolean>(false);
    let [draggable, setDraggable] = useState<boolean>(false);

    const bindClose = () => {
        setOpen(false);
    }
    const bindOk = async () => {
        setLoading(true)
        let result = await props.onFinish?.();
        setLoading(false);
        if (result) {
            bindClose();
        }
    }
    const bindSetDraggable = (value: boolean) => {
        if (propsDraggable) {
            setDraggable(value);
        }
    }

    const triggerDom = useMemo(()=>{
        if (!trigger) {
            return null;
        }
        return React.cloneElement(trigger, {
            key: 'trigger',
            ...trigger.props,
            onClick: async (e: any) => {
                setOpen(!open);
                trigger.props?.onClick?.(e);
            },
        });
    },[setOpen,trigger,open])


    return (
        <>
            {triggerDom}
            <AntdModal
                open={open}
                confirmLoading={loading}
                onCancel={bindClose}
                onOk={bindOk}
                {...props}
                title={(
                    <div
                        style={{cursor: propsDraggable ? 'move' : ''}}
                        onMouseOver={() => bindSetDraggable(true)}
                        onMouseOut={() => bindSetDraggable(false)}>
                        {props.title}
                    </div>
                )}
                modalRender={(modalRender) => (
                    <Draggable
                        disabled={!draggable}
                        allowAnyClick={true}
                    >
                        <div>{modalRender}</div>
                    </Draggable>
                )}>
                {props.children}
            </AntdModal>
        </>
    );
}

Modal.success = AntdModal.success;
Modal.confirm = AntdModal.confirm;
Modal.warning = AntdModal.warning;
Modal.info = AntdModal.info;
Modal.error = AntdModal.error;

Modal.useModal = AntdModal.useModal;
Modal.destroyAll = AntdModal.destroyAll;
Modal.config = AntdModal.config;

Object.assign(Modal, AntdModal);
export {Modal}