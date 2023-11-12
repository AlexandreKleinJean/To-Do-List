import { Sequelize } from 'sequelize';

let sequelize: Sequelize | null = null;

const pgUrl: string | undefined = process.env.PG_URL;

if (pgUrl) {
    sequelize = new Sequelize(pgUrl, {
        dialect: "postgres"
    });
} else {
    console.error("La variable d'environnement PG_URL n'est pas définie.");
}

export default sequelize as Sequelize;
