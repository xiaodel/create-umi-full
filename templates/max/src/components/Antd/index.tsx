import React, {useEffect, useMemo, useRef, useState} from 'react';

export * from "antd";
import Draggable, {DraggableBounds, DraggableEvent, DraggableData} from 'react-draggable';
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
    let [bounds, setBounds] = useState<DraggableBounds>({});
    let [loading, setLoading] = useState<boolean>(false);
    let [draggable, setDraggable] = useState<boolean>(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    let draggableRef: any = useRef(null);

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

    const triggerDom = useMemo(() => {
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
    }, [setOpen, trigger, open])

    const onStart = (e: DraggableEvent, data: DraggableData) => {
        let client = draggableRef.current?.getBoundingClientRect();
        const {innerWidth, innerHeight} = window;
        let padding = 10;
        setBounds({
            left: -client?.left + data.x + padding,
            right: innerWidth - (client?.right - data.x) - padding,
            top: -client?.top + data.y + padding,
            bottom: innerHeight - (client?.bottom - data.y) - padding
        })
    }
    const handleDrag = (e:any, ui:any) => {
        const { x, y } = ui;
        setPosition({ x, y });
    };

    const handleReset = () => {
        setPosition({ x: 0, y: 0 });
    };

    // useEffect(()=>{
    //     window.addEventListener('resize',handleReset);
    //     return()=>{
    //         return  window.removeEventListener('resize',handleReset);
    //     }
    // },[])

    useEffect(()=>{
        handleReset();
    },[props.open,open]);

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
                        bounds={bounds}
                        position={position}
                        allowAnyClick={true}
                        onStart={onStart}
                        onDrag={handleDrag}
                    >
                        <div ref={draggableRef}>{modalRender}</div>
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