import { Entity, PrimaryColumn, Column, ManyToOne, ManyToMany, JoinColumn } from "typeorm";


@Entity({ database: 'PGW_Authen_dev', schema: 'public' })
export class Authen_Credential {
    @PrimaryColumn()
    partnerid: string;

    @Column()
    partnersecret: string;

    @Column()
    permission: string;

}
