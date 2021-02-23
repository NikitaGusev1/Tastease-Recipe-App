import SQLite from 'react-native-sqlite-storage';

export const db = SQLite.openDatabase(
  {
    name: 'main',
    location: 'default',
    createFromLocation: '~SQLite.db',
  },
  () => {},
  (error) => {
    console.log('ERROR: ' + error);
  },
);

export const ExecuteQuery = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.transaction((trans) => {
      trans.executeSql(
        sql,
        params,
        (trans, results) => {
          resolve(results);
        },
        (error) => {
          reject(error);
        },
      );
    });
  });

export const InsertQuery = async (props) => {
  // single insert query
  let singleInsert = await ExecuteQuery(
    'INSERT INTO Users (username, password, generatedUsername, hash) VALUES ( ?, ?, ?, ?)',
    [props.username, props.password, props.generatedUsername, props.hash],
  );
  console.log("Inserted : " + singleInsert);
};

export const SelectQuery = async (props) => {
    let selectQuery = await ExecuteQuery("SELECT * FROM users",[]);
    var rows = selectQuery.rows;
    for (let i = 0; i < rows.length; i++) {
        var item = rows.item(i);
    }
    
}