import { MigrationInterface, QueryRunner, Table, TableColumnOptions } from "typeorm";

export class SchemaInitialization1713882508588 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Base column data for common 'person' base entity
        const personColumns: TableColumnOptions[] = [
            {
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
            },
            {
                name: 'first_name',
                type: 'varchar',
                isNullable: false,
            },
            {
                name: 'last_name',
                type: 'varchar',
                isNullable: false,
            },
            {
                name: 'father_name',
                type: 'varchar',
                isNullable: false,
            },
            {
                name: 'age',
                type: 'int',
                isNullable: false,
            },
            {
                name: 'created_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            },
            {
                name: 'updated_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                onUpdate: 'CURRENT_TIMESTAMP',
            },
        ];

        // Create 'user' table
        await queryRunner.createTable(
            new Table(
                {
                    name: 'api_user',
                    columns: personColumns,
                }
            ),
            true,
        );

        // Create 'child' table
        await queryRunner.createTable(
            new Table(
                {
                    name: 'child',
                    columns: [
                        ...personColumns,
                        {
                            name: 'parent_id',
                            type: 'int',
                            isNullable: false,
                        }
                    ],
                    foreignKeys: [
                        {
                            columnNames: ['parent_id'],
                            referencedTableName: 'api_user',
                            referencedColumnNames: ['id'],
                            onDelete: 'CASCADE',
                        }
                    ],
                },
            ),
            true,
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('child', true, true);
        await queryRunner.dropTable('api_user', true);
    }

}
