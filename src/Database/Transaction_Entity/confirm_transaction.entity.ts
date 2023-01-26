import { Entity, PrimaryColumn, Column, ManyToOne, ManyToMany, JoinColumn, OneToOne } from "typeorm";



@Entity({ database: 'db-pgw-transaction-service', schema: 'public', name: 'confirm_transaction' })
export class Confirm_transaction {
    @PrimaryColumn({ type: 'varchar', length: 20, nullable: false })
    bss_txn_id: string;

    @PrimaryColumn()
    txn_uuid: string;

    @PrimaryColumn({ type: 'varchar', length: 20, nullable: false })
    merchant_id: string;

    @Column({ type: 'integer', nullable: false })
    payment_channel_id: number;

    @Column({ type: 'integer', nullable: false })
    payment_channel_config_id: number;

    @Column({ type: 'timestamptz', nullable: false })
    request_datetime: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    client_request_id: string;

    @Column({ type: 'integer', nullable: false })
    txn_type_id: number;

    @Column({ type: 'timestamptz', nullable: false })
    payment_status_datetime: string;

    @Column({ type: 'integer', nullable: false })
    payment_status: number;

    @Column({ type: 'integer', nullable: false })
    confirm_type: number;

    @Column({ type: 'varchar', length: 20, nullable: true })
    master_merchant_id: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    location_id: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    device_id: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    cashier_id: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    payment_channel_txn_id: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    payment_channel_method: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    payment_channel_name: string;

    @Column({ type: 'text', nullable: false })
    payment_code: string;

    @Column({ type: 'integer', nullable: false })
    payment_type_id: number;

    @Column({ type: 'timestamptz', nullable: false })
    payment_code_receive_datetime: string;

    @Column({ type: 'integer', nullable: false })
    expire_time: number;

    @Column({ type: 'timestamptz', nullable: false })
    expire_at: string;

    @Column({ type: 'boolean', nullable: false })
    callback_payment_channel_status: boolean;

    @Column({ type: 'timestamptz', nullable: true })
    callback_payment_channel_timestamp: string;

    @Column({ type: 'boolean', nullable: false })
    callback_merchant_status: boolean;

    @Column({ type: 'timestamptz', nullable: true })
    callback_merchant_timestamp: string;

    @Column({ type: 'integer', nullable: false })
    callback_merchant_retry_count: number;

    @Column({ type: 'text', nullable: true })
    product_detail: string;

    @Column({ type: 'varchar', length: 3, nullable: false })
    currency: string;

    @Column({ type: 'integer', nullable: false })
    amount: number;

    @Column({ type: 'varchar', length: 20, nullable: false })
    reference1: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    reference2: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    reference3: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    reference4: string;

    @Column({ type: 'integer', nullable: false })
    device_type_id: number;

    @Column({ type: 'varchar', length: 500, nullable: true })
    notify_url: number;

    @Column({ type: 'integer', nullable: false })
    inquiry_count: number;



    // @Column({ type: 'boolean', nullable: false })
    // settlement_status: boolean;

    // @Column({ type: 'timestamptz', nullable: true })
    // settlement_datetime: string;

    // @Column({ type: 'timestamptz', nullable: true })


    // @OneToMany(() =>payment_channel, (payment_channel) => payment_channel.payment_channel_id) 

    // @ManyToOne(() => Online_order_transaction, { lazy: true })
    // @JoinColumn({ name: 'order_id' })
    // order_id: Online_order_transaction;

    // @OneToOne(() => Payment_channel, payment_channel => payment_channel.payment_channel_id)
    // @JoinColumn({ name: 'payment_channel_id' })
    // payment_channel_id: Payment_channel
}
