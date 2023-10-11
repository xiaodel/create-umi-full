// 全局共享数据示例
import { DEFAULT_NAME } from '@/constants';
import {useEffect, useState} from 'react';
import {getUserDetail} from '@/services';
import {message} from "antd";

const useUser = () => {
  const [data, setData] = useState<any>({name:DEFAULT_NAME});

  useEffect(()=>{
    getUser();
  },[])

  const getUser = () => {
    getUserDetail({token:'dsfdsf'}).then(result=>{
      if (result?.data) {
        setData((values:any)=>({...values,user:result?.data}))
      } else {
        message.error('账号或者密码错误')
      }
    })
  }

  return {
    data,
    setData,
  };
};

export default useUser;
