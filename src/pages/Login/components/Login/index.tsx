import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, MessagePlugin, Input, Checkbox, Button, FormInstanceFunctions, SubmitContext } from 'tdesign-react';
import { LockOnIcon, UserIcon, BrowseOffIcon, BrowseIcon, RefreshIcon } from 'tdesign-icons-react';
import classnames from 'classnames';
import QRCode from 'qrcode.react';
import { useAppDispatch } from 'modules/store';
import { login } from 'modules/user';
import useCountdown from '../../hooks/useCountDown';

import Style from './index.module.less';
import { toLogin } from 'services/login';

const { FormItem } = Form;

export type ELoginType = 'password' | 'phone' | 'qrcode';

export default function Login() {
  const [loginType, changeLoginType] = useState<ELoginType>('password');
  const [showPsw, toggleShowPsw] = useState(false);
  const [rememberPwd, setRememberPwd] = useState([]);

  const { countdown, setupCountdown } = useCountdown(60);
  const formRef = useRef<FormInstanceFunctions>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = async (e: SubmitContext) => {
    if (e.validateResult === true) {
      const formValue = formRef.current?.getFieldsValue?.(true) || {};
      const logInfo = await toLogin(formValue);
      await dispatch(login(logInfo.user));
      localStorage.setItem('token', logInfo.token);
      if (rememberPwd && rememberPwd.length) {
        localStorage.setItem('rememberPwd', JSON.stringify(rememberPwd));
        localStorage.setItem('loginUser', JSON.stringify(formValue));
      } else {
        localStorage.removeItem('rememberPwd');
        localStorage.removeItem('loginUser');
      }

      MessagePlugin.success('登录成功');
      navigate('/dashboard/base');
    }
  };

  const switchType = (val: ELoginType) => {
    formRef.current?.reset?.();
    changeLoginType(val);
  };
  useEffect(() => {
    // 检查是否记住账号信息
    const isRememberAccount = localStorage.getItem('rememberPwd');
    if (isRememberAccount) {
      // 如果记住账号信息，则设置记住密码的状态
      setRememberPwd(JSON.parse(isRememberAccount));
      // 尝试从localStorage获取登录用户信息
    }
  }, []);
  const getLoginInfo = (key: string): string => {
    if (import.meta.env.MODE === 'development') {
      switch (key) {
        case 'username':
          return 'super_leven';
        case 'password':
          return 'leven123456';
        default:
          return '';
      }
    }
    const loginUser = localStorage.getItem('loginUser');
    if (loginUser) {
      // 如果登录用户信息存在，则解析账号信息
      const account = JSON.parse(loginUser);
      switch (key) {
        // 根据key返回对应的用户信息
        case 'username':
          return account.username;
        case 'password':
          return account.password;
        default:
          // 如果key不匹配任何信息，返回空字符串
          return '';
      }
    }
    return '';
  };
  return (
    <div>
      <Form
        ref={formRef}
        className={classnames(Style.itemContainer, `login-${loginType}`)}
        labelWidth={0}
        onSubmit={onSubmit}
      >
        {loginType === 'password' && (
          <>
            <FormItem
              name='username'
              initialData={getLoginInfo('username')}
              rules={[{ required: true, message: '账号必填', type: 'error' }]}
            >
              <Input size='large' clearable placeholder='请输入账号' prefixIcon={<UserIcon />}></Input>
            </FormItem>
            <FormItem
              name='password'
              initialData={getLoginInfo('password')}
              rules={[{ required: true, message: '密码必填', type: 'error' }]}
            >
              <Input
                size='large'
                type={showPsw ? 'text' : 'password'}
                defaultValue='22222'
                placeholder='请输入登录密码'
                prefixIcon={<LockOnIcon />}
                suffixIcon={
                  showPsw ? (
                    <BrowseIcon onClick={() => toggleShowPsw((current) => !current)} />
                  ) : (
                    <BrowseOffIcon onClick={() => toggleShowPsw((current) => !current)} />
                  )
                }
              />
            </FormItem>
            <div className={classnames(Style.checkContainer, Style.rememberPwd)}>
              <Checkbox.Group value={rememberPwd} onChange={setRememberPwd}>
                <Checkbox value='1' checked={!!rememberPwd.length}>
                  记住账号
                </Checkbox>
              </Checkbox.Group>
              <span className={Style.checkContainerTip}>忘记账号？</span>
            </div>
          </>
        )}

        {/* 扫码登陆 */}
        {loginType === 'qrcode' && (
          <>
            <div className={Style.tipContainer}>
              <span className='tip'>请使用微信扫一扫登录</span>
              <span className='refresh'>
                刷新 <RefreshIcon />
              </span>
            </div>
            <QRCode value='' size={200} />
          </>
        )}
        {/* // 手机号登陆 */}
        {loginType === 'phone' && (
          <>
            <FormItem name='phone' rules={[{ required: true, message: '手机号必填', type: 'error' }]}>
              <Input maxlength={11} size='large' placeholder='请输入您的手机号' prefixIcon={<UserIcon />} />
            </FormItem>
            <FormItem name='verifyCode' rules={[{ required: true, message: '验证码必填', type: 'error' }]}>
              <Input size='large' placeholder='请输入验证码' />
              <Button
                variant='outline'
                className={Style.verificationBtn}
                disabled={countdown > 0}
                onClick={setupCountdown}
              >
                {countdown === 0 ? '发送验证码' : `${countdown}秒后可重发`}
              </Button>
            </FormItem>
          </>
        )}
        {loginType !== 'qrcode' && (
          <FormItem className={Style.btnContainer}>
            <Button block size='large' type='submit'>
              登录
            </Button>
          </FormItem>
        )}
        <div className={Style.switchContainer}>
          {loginType !== 'password' && (
            <span className='tip' onClick={() => switchType('password')}>
              使用账号密码登录
            </span>
          )}
          {loginType !== 'qrcode' && (
            <span className='tip' onClick={() => switchType('qrcode')}>
              使用微信扫码登录
            </span>
          )}
          {loginType !== 'phone' && (
            <span className='tip' onClick={() => switchType('phone')}>
              使用手机号登录
            </span>
          )}
        </div>
      </Form>
    </div>
  );
}
