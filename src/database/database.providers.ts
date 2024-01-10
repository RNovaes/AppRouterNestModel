import { DataSource } from 'typeorm';

// export const databaseProviders = [
//   {
//     provide: 'DATA_SOURCE',
//     useFactory: async () => {
//       const dataSource = new DataSource({
//         type: 'mysql',
//         host: '195.35.38.144',
//         port: 3306,
//         username: 'u383719585_teste_r',
//         password: ']Ke?H@9nR',
//         database: 'u383719585_teste_r',
//         entities: [
//             __dirname + '/../**/*.entity{.ts,.js}',
//         ],
//         synchronize: false,
//       });

//       return dataSource.initialize();
//     },
//   },
// ];

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'projetopadaria',
        entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: false,
      });
      return dataSource.initialize();
    },
  },
  
];
