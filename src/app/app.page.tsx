import { Route as ReactDomRoute, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { lazy, useEffect } from "react";

import { env } from "./legacy/env.tool";

import { AppRoutes } from "./app.routes";
import { Route } from "./features/navigation/models/route.model";
import { PageTitleUI } from "./features/navigation/ui/page-title.ui";
import { useSessionFeature } from "./features/session/session.feature";
import NotFoundPage from "./features/navigation/pages/not-found/not-found.page";

import useSWR from "swr";

const Login = lazy(() => import("src/app/pages/login/login.page"));

declare global {
  interface Heap {
    identify(id: string): void;
  }

  interface Window {
    Intercom: any;
    heap: Heap;
  }
}

const App = () => {
  const { user, canINavigateTo, getUser, setUser } = useSessionFeature();
  const { data } = useSWR("getUser", getUser);

  useEffect(() => {
    setUser(data);
  }, [data]);

  function renderRoute(route: Route) {
    if (!canINavigateTo(route)) return null;
    return (
      <ReactDomRoute
        key={route.path + route.title}
        path={route.path}
        element={
          <>
            <PageTitleUI title={route.title} />
            <route.element />
          </>
        }
      >
        {Array.isArray(route.children) && route.children.map(renderRoute)}
      </ReactDomRoute>
    );
  }

  useEffect(() => {
    const APP_ID = env("VITE_INTERCOM_APP_ID");
    if (user) {
      window.heap.identify(user.email);
      window.Intercom("boot", {
        app_id: APP_ID,
        name: user.name,
        email: user.email,
        created_at: new Date().getTime(),
      });
    } else {
      window.Intercom("shutdown");
    }
  }, [user]);

  return (
    <>
      <Routes>
        <ReactDomRoute path="/login" element={<Login />} />
        <ReactDomRoute path="*" element={<NotFoundPage />} />
        {AppRoutes.map(renderRoute)}
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
