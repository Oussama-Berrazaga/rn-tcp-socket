import React, {useState, useRef} from 'react';
import TcpSocket from 'react-native-tcp-socket';
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  View,
  ScrollView,
  Text,
  Button,
} from 'react-native';

const PRIMARY_COLOR = 'skyblue';
const ipAddress = '192.168.43.120';
const options = {
  port: 12345,
  //host: '127.0.0.1',
  host: ipAddress,
  // localAddress: '127.0.0.1',
  reuseAddress: true,
  // localPort: 20000,
  // interface: "wifi",
};

function App() {
  const [log, setLog] = useState('');
  const logScrollView = useRef(null);
  function printVpnState() {
    updateLog(JSON.stringify('', undefined, 2));
  }
  function updateLog(newLog) {
    const now = new Date().toLocaleTimeString();
    setLog(`${log}\n[${now}] ${newLog}`);
  }
  const startTCPserver = () => {
    const server = TcpSocket.createServer(function (socket) {
      socket.on('data', data => {
        socket.write('Echo server ' + data);
        updateLog('Echo server ' + data);
      });

      socket.on('error', error => {
        console.log('An error ocurred with client socket ', error);
        updateLog('An error ocurred with client socket ' + error);
      });

      socket.on('close', error => {
        console.log('Closed connection with ', socket.address());
        updateLog('Closed connection with ' + socket.address());
      });
    }).listen({port: 12345, host: ipAddress});

    server.on('error', error => {
      console.log('An error ocurred with the server', error);
      updateLog('An error ocurred with the server' + error);
    });

    server.on('close', () => {
      console.log('Server closed connection');
      updateLog('Server closed connection');
    });
  };
  const startTCPclient = () => {
    // Create socket
    const client = TcpSocket.createConnection(options, () => {
      // Write on the socket
      updateLog('starting tcp client');
      client.write('Hello server!!!');
      //client.write('Hello server!');
      //client.write('Hello server!');

      // Close socket
      //client.destroy();
    });

    client.on('data', function (data) {
      console.log('message was received ', data.toString());
      updateLog('message was received ' + data.toString());
    });

    client.on('error', function (error) {
      console.log(error);
      updateLog(error);
    });

    client.on('close', function () {
      console.log('Connection closed!');
      updateLog('Connection closed!');
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.btnContainer}>
        <Button
          title="start server"
          color={PRIMARY_COLOR}
          onPress={startTCPserver}
        />
        <Button
          title="start client"
          color={PRIMARY_COLOR}
          onPress={startTCPclient}
        />
        <Button
          title="Clear Log"
          color={PRIMARY_COLOR}
          onPress={() => setLog('')}
        />
      </View>
      <View style={styles.logContainer}>
        <ScrollView
          ref={logScrollView}
          style={styles.logScroll}
          onContentSizeChange={() =>
            logScrollView.current.scrollToEnd({animated: true})
          }>
          <Text>{log}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '20%',
  },
  btnContainer: {
    width: '80%',
    height: '25%',
    justifyContent: 'space-between',
  },
  logContainer: {
    width: '80%',
    height: '70%',
    borderColor: PRIMARY_COLOR,
    borderWidth: 2,
    marginTop: 10,
    padding: 10,
  },
  logScroll: {
    flex: 1,
  },
});

export default App;
