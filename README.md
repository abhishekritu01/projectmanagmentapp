# Project Management App

This is a Project Management application built using the T3 stack. The stack includes:
- **Supabase**: For the database
- **NextAuth**: For authentication
- **tRPC**: For type-safe APIs
- **Next.js**: For the frontend framework
- **Prisma**: For the ORM

## Features

- User authentication with credentials (login and registration)
- Create, read, update, and delete (CRUD) operations for projects and tasks
- Assign tasks to multiple users
- Dashboard to display various statistics
- Filtering on tasks and projects

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js
- npm or yarn

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/project-management-app.git
    cd project-management-app
    ```

2. **Install the dependencies:**

    ```sh
    npm install
    # or
    yarn install
    ```

3. **Set up the environment variables:**

    Create a `.env` file in the root of your project and add the following variables:

    ```plaintext
    # When adding additional environment variables, the schema in "/src/env.js"
    # should be updated accordingly.

    # Prisma
    # https://www.prisma.io/docs/reference/database-reference/connection-urls#env
    DATABASE_URL="postgresql://"

    # Next Auth
    # You can generate a new secret on the command line with:
    # openssl rand -base64 32
    # https://next-auth.js.org/configuration/options#secret
    NEXTAUTH_SECRET="your_secret_key"
    NEXTAUTH_URL="http://localhost:3000"

    # # Next Auth Discord Provider (Optional)
    # DISCORD_CLIENT_ID=""
    # DISCORD_CLIENT_SECRET=""
    ```

4. **Set up the database:**

    Run the Prisma migrations to set up your database schema:

    ```sh
    npx prisma migrate dev --name init      || npx prisma push db
    ```

5. **Start the development server:**

    ```sh
    npm run dev
    # or
    yarn dev
    ```

    Your application should now be running on [http://localhost:3000](http://localhost:3000).

### Project Structure

- `/src`: Contains the source code of the application
  - `/env.js`: Schema for environment variables
  - `/pages`: Next.js pages
  - `/api`: tRPC API routes
  - `/auth`: NextAuth configuration
  - `/prisma`: Prisma schema and client

### Authentication

This project uses NextAuth for handling authentication with credentials. Users can register and log in using their email and password. Sessions are managed to keep users logged in.

### Database

Supabase is used as the database provider. Prisma is used to interact with the database. Ensure your `DATABASE_URL` in the `.env` file is correctly configured to connect to your Supabase instance.

### API

tRPC is used to create type-safe APIs. You can find the API routes in the `/src/api` directory.

### Dashboard

The dashboard provides an overview of various statistics related to projects and tasks. It includes features to filter tasks and projects based on different criteria.

### Contributing

Contributions are welcome! Please create an issue or submit a pull request for any feature requests or bug fixes.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

**Note:** Replace `"your_secret_key"` in the `.env` file with an actual secret key generated using `openssl rand -base64 32` or any other secure method.

Happy coding!
