import emailModel from '../../models/email';
import noteModel from '../../models/note';
import userModel from '../../models/user';
import table from '../table';
import executeQuery from './executeQuery';

export const emails = table(emailModel, executeQuery);
export const notes = table(noteModel, executeQuery);
export const users = table(userModel, executeQuery, { emails, notes });