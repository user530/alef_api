import { MigrationInterface, QueryRunner } from "typeorm";

export class DataInitialization1713885502521 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Placeholder data for users
        const users = [
            {
                first_name: 'Ефим',
                last_name: 'Ярошинский',
                father_name: 'Венедиктович',
                age: 39,
            },
            {
                first_name: 'Егор',
                last_name: 'Безукладников',
                father_name: 'Фёдорович',
                age: 48,
            },
            {
                first_name: 'Альбина',
                last_name: 'Созонова',
                father_name: 'Кирилловна',
                age: 33,
            },
            {
                first_name: 'Артем',
                last_name: 'Горбачёв',
                father_name: 'Наумович',
                age: 34,
            },
            {
                first_name: 'Оксана',
                last_name: 'Мосенцова',
                father_name: 'Семеновна',
                age: 40,
            },
        ];

        // Prepare user query
        const usersInsertQuery = `INSERT INTO api_user (first_name, last_name, father_name, age)
            VALUES ${users
                .map(
                    ({ first_name, last_name, father_name, age }) => `('${first_name}', '${last_name}', '${father_name}', ${age})`)
                .join(', ')
            }`;

        // Execute the query
        await queryRunner.query(usersInsertQuery);

        const inserted = await queryRunner.manager.find('api_user');
        console.log(inserted);

        // Placeholder data for children
        const children = [
            {
                last_name: 'Ярошинский',
                first_name: 'Антон',
                father_name: 'Ефимович',
                age: 9,
                parent_id: inserted[0].id,
            },
            {
                last_name: 'Ярошинская',
                first_name: 'Мария',
                father_name: 'Ефимовна',
                age: 8,
                parent_id: inserted[0].id,
            },
            {
                last_name: 'Иванов',
                first_name: 'Борис',
                father_name: 'Петрович',
                age: 13,
                parent_id: inserted[2].id,
            },
            {
                last_name: 'Горбачёва',
                first_name: 'Дарья',
                father_name: 'Артемовна',
                age: 4,
                parent_id: inserted[3].id,
            },
        ];

        // Prepare children query
        const childrenInsertQuery = `INSERT INTO child (first_name, last_name, father_name, age, parent_id)
            VALUES 
            ${children
                .map(
                    ({ first_name, last_name, father_name, age, parent_id }) => `('${first_name}', '${last_name}', '${father_name}', ${age}, ${parent_id})`)
                .join(', ')
            }`

        // Execute the query
        await queryRunner.query(childrenInsertQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM "child"');
        await queryRunner.query('DELETE FROM "api_user"');
    }

}
