#include <WiFi.h>
#include <PubSubClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
const int oneWireBus = 21;

// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(oneWireBus);

// Pass our oneWire reference to Dallas Temperature sensor
DallasTemperature sensors(&oneWire);
// WiFi
const char *ssid = "Royal PG 2nd 3rd 4th";  // Enter your Wi-Fi name
const char *password = "Royal@66";          // Enter Wi-Fi password
const char *mqtt_broker = "13.233.207.131";
const char *mqtt_username = "devagya";
const char *mqtt_password = "devagya";
const int mqtt_port = 1883;
const char *topic = "esp32/body-temp";
WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  // Set software serial baud to 115200;
  Serial.begin(115200);
  sensors.begin();
  // Connecting to a WiFi network
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the Wi-Fi network");
  //connecting to a mqtt broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  while (!client.connected()) {
    String client_id = "esp32-client-";
    client_id += String(WiFi.macAddress());
    Serial.printf("The client %s connecting to the public MQTT broker\n", client_id.c_str());
    if (client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("Public EMQX MQTT broker connected");
    } else {
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }
//   sensors.requestTemperatures();
//   float temperatureC = sensors.getTempCByIndex(0);
//   String polishedTempC = String(temperatureC);
//   const char *finalTempC = polishedTempC.c_str();
//   // Publish and subscribe
//   Serial.println(finalTempC);
//   client.publish(topic, finalTempC);
//   client.subscribe(topic);
}

void callback(char *topic, byte *payload, unsigned int length) {
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message:");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
  Serial.println("-----------------------");
}

void loop() {
  sensors.requestTemperatures();
  float temperatureC = sensors.getTempCByIndex(0);
  String polishedTempC = String(temperatureC);
  const char *finalTempC = polishedTempC.c_str();
  // Publish and subscribe
  Serial.println(finalTempC);
  Serial.println(temperatureC );
  client.publish(topic, finalTempC);
  client.subscribe(topic);
  delay(2000);
}