import React, { useState } from "react";
import Head from "next/head";
import Layout from "~/components/Layout";
import DashBoard from "~/components/DashBoard";
import Team from "~/components/Team";
import Project from "~/components/Project";
import Profile from "~/components/Profile";
import TaskList from "~/components/TaskList";
import ProjectList from "~/components/ProjectList";
import CreateProject from "~/components/CreateProject";
import TaskManagmant from "~/components/TaskManagmant";
import Model from "~/components/Model";
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  RectangleStackIcon,
  UsersIcon,
  XMarkIcon,
  UserCircleIcon,
  Square3Stack3DIcon,
  PlusCircleIcon
} from '@heroicons/react/20/solid'
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { useSession, signIn, signOut } from "next-auth/react";

interface Navigation {
  name: string;
  component: JSX.Element;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  current: boolean;
}

const navigation = [
  { name: 'Dashboard', component: <DashBoard />, icon: HomeIcon, current: true },
  { name: 'Team', component: <Team />, icon: UsersIcon, current: false },
  { name: 'Projects Managment', component: <Project />, icon: FolderIcon, current: false },
  { name: 'Task Create', component: <TaskManagmant />, icon: UserPlusIcon, current: false },
  { name: 'Profile', component: <Profile />, icon: UserCircleIcon, current: false },
  { name: 'Task List', component: <TaskList />, icon: RectangleStackIcon, current: false },
  { name: 'Project List', component: <ProjectList />, icon: Square3Stack3DIcon, current: false },
];

const Home = () => {
  const { data: sessionData } = useSession();
  const [createproject, setCreateProject] = useState<boolean>(false);
  const [activeComponent, setActiveComponent] = useState(<DashBoard />);

  const handleNavigationClick = (component: JSX.Element) => {
    setActiveComponent(component);
  };

  return (
    <>
      <Head>
        <title>Project Management App</title>
      </Head>
      <Layout navigation={navigation} setActiveComponent={handleNavigationClick}>
        <div className="p-4">
          {createproject && (
            <CreateProject
              createproject={createproject}
              setCreateProject={setCreateProject}
            />
          )}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Project Management App </h1>

            <div className="flex items-center gap-2">
              {sessionData ? (
                <button
                  onClick={() => setCreateProject(true)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md flex items-center gap-1"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  Create Project
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="bg-green-500 text-white px-3 py-1 rounded-md"
                >
                  Login
                </button>
              )}
              {sessionData && (
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-3 py-1 rounded-md"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
          <div className="text-center mt-2">
            {sessionData ? (
              <div className="flex flex-col gap-2">
                <span className="text-gray-600 ">Username: {sessionData.user.username}</span>
                <span className="text-gray-600">Email: {sessionData.user.email}</span>
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-center">
                Please login to view the content
              </h1>
            )}
          </div>
          <div className="mt-4">
            {activeComponent}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
