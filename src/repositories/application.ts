import { getDatabase } from '../database/database';
import { SupportedLanguage } from '../i18n/config';
import { rowsToJsRecords } from '../utils/utils';


export type Application = {
    id: number;
    name: string;
    is_init_data_loaded: boolean;
    preferences: string;
};

export type ApplicationJs = {
    id: number;
    name: string;
    is_init_data_loaded: boolean;
    preferences: { language: string, theme: string };
};

const booleanColumns = new Set(['is_init_data_loaded']);

export async function getApplication(): Promise<ApplicationJs | null> {
    const db = getDatabase();

    const { results } = await db.executeAsync<Application>(
        'SELECT * FROM application where id = 1'
    );

    if (results.length > 0) {
        let record = rowsToJsRecords<Application>(results, booleanColumns)[0];

        const recordJs = { ...record, preferences: JSON.parse(record.preferences) };

        return recordJs;
    }

    return null;
}



export async function updateAppLang(newLang: SupportedLanguage) {
    try {
        const db = getDatabase();

        await db.executeAsync(
            `UPDATE application
             SET preferences = json_set(
                 preferences,
                 '$.language',
                 ?
             )
             WHERE id = ?
             `,
            [newLang, 1]
        );
    } catch (error) {
        console.log('Application update failed!');

        throw error;
    }
}
