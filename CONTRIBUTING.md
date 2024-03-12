# Contributing to 7419 Scouting App

Thank you for considering contributing to the 7419 Scouting App! We appreciate your interest in making our project
better.

## How to Contribute

Contributing to the 7419 Scouting App is easy! You can contribute in several ways:

1. **Reporting Bugs**: If you encounter any bugs or issues while using the app,
   please [submit a bug report](https://github.com/frc-7419/crescendo-2024-scouting-site/issues/new?assignees=&labels=bug)
   on our GitHub repository.

2. **Feature Requests**: Have an idea for a new feature or improvement? Feel free
   to [submit a feature request](https://github.com/frc-7419/crescendo-2024-scouting-site/issues/new?assignees=&labels=enhancement)
   outlining your proposal.

3. **Code Contributions**: If you're comfortable with coding, you can fork the repository, make changes, and submit a
   pull request. Make sure to follow our code contribution guidelines below.

## Code Contribution Steps

it is a bit difficult to set up the project because it was meant for our vercel production but we are working on making
it easier.

1. **Clone the Repository**: Clone the repository to your local machine using Git.

    ```bash
    git clone https://github.com/frc-7419/crescendo-2024-scouting-site
    ```

2. **Set Up the Project**: Install the project dependencies and set up the project on your local machine.

    ```bash
    cd crescendo-2024-scouting-site
    npm install
    ```

3. **Environment Variables**: Create a `.env.local` file in the root of the project and add the following environment
   variables:

    ```env
   NEXTAUTH_SECRET='random hash'
   BLUEALLIANCE_API_KEY=
   SENTRY_AUTH_TOKEN='optional'
   CRON_SECRET='random hash'
   DATABASE_URL=
   DIRECT_URL=
   NEXT_PUBLIC_SENTRY_DSN='optional'
    ```
   For the `DATABASE_URL` and `DIRECT_URL` you can use a local postgres database or a supabase database. These two
   values are separate because we are using Prisma Accelerate for most of the queries `DATABASE_URL` and for the cron
   job updates `DIRECT_URL` directly linked to the supabase db to save accelerate bandwidth.

   You can set both to your local db for testing.

4. **Initialize the Database**: Run the following command to initialize the database and create the required tables.

    ```bash
   npx prisma db push
    ```

5. You can then start the development server using:

    ```bash
    next dev
    ```

   The app will be available at `http://localhost:3000`.

6. **Make Changes**: Make your desired changes to the codebase.

7. **Test Your Changes**: Ensure that your changes work as expected and don't introduce any new issues.
   Run
   ```bash
   next build
   ``` 
   to check for any build errors.

8. **Submit a Pull Request**: Finally, submit a pull request from your forked repository to the main repository.

## Code Style Guidelines

- Follow the existing code style and conventions used in the project.
- Use readable variable and function names.

sorry our code style is a bit of a mess so it would be hypocritical to enforce comments.

## License

By contributing to the 7419 Scouting App, you agree that your contributions will be licensed under
the [GPL-3.0 license](https://github.com/frc-7419/crescendo-2024-scouting-site/blob/master/LICENSE).

## Need Help?

If you need any assistance or have questions regarding contributing to the project, feel free
to [contact us](https://7419.tech/about/contact) or reach out to us
on [GitHub Discussions](https://github.com/frc-7419/crescendo-2024-scouting-site/discussions).

We appreciate your support and look forward to your contributions!

— The 7419 Programming Team
