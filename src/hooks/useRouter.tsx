import { selectGlobal } from 'modules/global';
import { useAppSelector } from 'modules/store';
import React, { lazy, useEffect, useState } from 'react';
import { IRouter, beforeRoutes, afterRoutes } from 'router';
import { Icon } from 'tdesign-icons-react';

export const useRouters = (): IRouter[] => {
  const modules = import.meta.glob('pages/**/*.tsx');
  const [routers, setRouters] = useState<IRouter[]>([]);
  const { routes } = useAppSelector(selectGlobal);
  const LazyLoad = (routes: IRouter[]): IRouter[] =>
    routes.map((item: IRouter): IRouter => {
      if (item.children) {
        item.children = LazyLoad(item.children);
      }
      if (item && item.Component && typeof item.Component === 'string') {
        const key = `../${item.Component}/index.tsx`;
        item.Component = lazy(modules[key] as any);
      }
      if (item.meta && item.meta.Icon) {
        const iconName: string = item.meta.Icon as unknown as string;
        item.meta.Icon = () => <Icon name={iconName} />;
      }
      return item;
    });
  const updateRouters: (routes: IRouter[]) => void = (routes: IRouter[]) => {
    setRouters([...beforeRoutes, ...LazyLoad(JSON.parse(JSON.stringify(routes))), ...afterRoutes]);
  };
  useEffect(() => {
    updateRouters(routes);
  }, [routes]);
  return routers;
};
