import { RiArrowRightUpLine } from '@remixicon/react';
import { Card, Divider } from '@tremor/react';
import { api } from "~/utils/api";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

interface User {
    id: string;
    email: string;
    username: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export default function Team() {
    const { data: userList, isLoading, isError } = api.post.getListOfUsers.useQuery();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading data</div>;
    }

    const generateInitials = (name: string | null) => {
        return name ? name.split(' ').map((n) => n[0]).join('') : '';
    };

    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const colors = [
        { textColor: 'text-fuchsia-800 dark:text-fuchsia-500', bgColor: 'bg-fuchsia-100 dark:bg-fuchsia-500/20' },
        { textColor: 'text-blue-800 dark:text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-500/20' },
        { textColor: 'text-pink-800 dark:text-pink-500', bgColor: 'bg-pink-100 dark:bg-pink-500/20' },
        { textColor: 'text-emerald-800 dark:text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-500/20' },
        { textColor: 'text-orange-800 dark:text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-500/20' },
        { textColor: 'text-indigo-800 dark:text-indigo-500', bgColor: 'bg-indigo-100 dark:bg-indigo-500/20' },
        { textColor: 'text-yellow-800 dark:text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-500/20' },
    ];

    return (
        <>
            <div className="flex items-center space-x-2 my-8">
                <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Members
                </h3>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-tremor-full bg-tremor-background-subtle text-tremor-label font-medium text-tremor-content-strong dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-strong">
                    {userList?.length}
                </span>
            </div>
            <Divider className="my-4" />
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {userList?.map((user: User, index: number) => {
                    const color = colors[index % colors.length] ?? { textColor: '', bgColor: '' };
                    const initials = generateInitials(user.username);
                    const formattedDate = formatDate(user.createdAt);
                    return (
                        <Card key={user.id} className="group">
                            <div className="flex items-center space-x-4">
                                <span
                                    className={classNames(
                                        color.bgColor,
                                        color.textColor,
                                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-tremor-default font-medium',
                                    )}
                                    aria-hidden={true}
                                >
                                    {initials}
                                </span>
                                <div className="truncate">
                                    <p className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                        <a href="#" className="focus:outline-none">
                                            {/* Extend link to entire card */}
                                            <span className="absolute inset-0" aria-hidden={true} />
                                            {user.username}
                                        </a>
                                    </p>
                                    <p className="truncate text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                        {user.email}
                                    </p>
                                    <p className="truncate text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                        Joined: {formattedDate}
                                    </p>
                                </div>
                            </div>
                            <span
                                className="pointer-events-none absolute right-4 top-4 text-tremor-content-subtle group-hover:text-tremor-content dark:text-dark-tremor-content-subtle group-hover:dark:text-dark-tremor-content"
                                aria-hidden={true}
                            >
                                <RiArrowRightUpLine className="h-4 w-4" aria-hidden={true} />
                            </span>
                        </Card>
                    );
                })}
            </div>
        </>
    );
}
