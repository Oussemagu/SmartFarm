# SmartFarm - IoT Greenhouse Monitoring System 🌿📈
SmartFarm is an IoT-powered greenhouse automation system that intelligently monitors and controls environmental conditions using a Raspberry Pi and Node.js backend.
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![InfluxDB](https://img.shields.io/badge/InfluxDB-2.x-blue)
![RaspberryPi](https://img.shields.io/badge/Raspberry_Pi-4B-red)

## Table of Contents
- [Features](#features)
- [Tech stack](#tech-stack)
- [Hardware Setup](#hardware-setup)

## Features
✅ Real-time environmental monitoring (temperature, humidity, light, soil moisture)  
✅ Automated control of lights, fans, water pump, and heater  
✅ Data storage with InfluxDB time-series database  
✅ Responsive REST API for remote management  
##  🛠 Tech stack 
-**Hardware** : Raspberry Pi + Sensors (DHT22..)
-**Backend**: Node.js + Express
-**Database** : InfluxDB (optimized for time-series data)
## Hardware Setup
### Required Components
| Component | Quantity |
|-----------|----------|
| Raspberry Pi 4 | 1 |
| DHT22 Sensor | 1 |
| TSL2561 Light Sensor | 1 |
| Soil Moisture Sensor | 1 |
| 6-Channel Relay Module | 1 |
| 12V Water Pump | 1 |
| LED Grow Lights | 1 set |

### Wiring Diagram
See [hardware/wiring_diagrams](hardware/wiring_diagrams) for detailed connections.

