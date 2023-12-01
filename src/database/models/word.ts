import { Table, Column, Model } from "sequelize-typescript";

@Table
export default class Word extends Model {
    @Column
    english: string;

    @Column
    boblish: string;
}
