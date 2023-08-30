import React, { Component } from "react";
import { Joystick } from "react-joystick-component"
import Config from "../scripts/config";
import ROSLIB from "roslib";

class Teleoperation extends Component{
    state={ ros:null };

    constructor() {
        super();
        this.init_connection();

        this.handleMove = this.handleMove.bind(this);
        this.handleStop = this.handleStop.bind(this);

    }

    init_connection(){
        this.state.ros = new ROSLIB.Ros();
        //var ros = new window.ROSLIB.Ros();
        console.log(this.state.ros);

        this.state.ros.on("connection", () =>{
            console.log("connection established!");
            this.setState({ connected: true });

        });



        this.state.ros.on("close", () => {
            console.log("disconnection!!");
            this.setState({ connected: false });

            //try reconnecting every 3 seconds
            setTimeout(() => {
                try{
                    this.state.ros.connect(
                        "ws://" +
                            Config.ROSBRIDGE_SERVER_IP +
                            ":" +
                            Config.ROSBRIDGE_SERVER_PORT +
                 "");
                } catch (error){
                    console.log("connect error !!")
                    this.setState({ connected: false })
            }
            }, 1000);            

        });

        this.state.ros.on("error", () => {
            console.log("connect error !!");
            this.setState({ connected: false });
            setTimeout(() => {
                try{
                    this.state.ros.connect("ws://" +
                    Config.ROSBRIDGE_SERVER_IP +
                    ":" +
                    Config.ROSBRIDGE_SERVER_PORT +
         "");
                } catch (error){
                    console.log("connect error !!")
                    this.setState({ connected: false })
            }
            }, Config.RECONNECTION_TIMER); 

        });

    }

    handleMove(){
        console.log("Robot moving");
        //We need to create a ROS publisher on the topic cmd_vel
        var cmd_vel = new ROSLIB.Topic({
            ros: this.state.ros,
            name: "/turtle1/cmd_vel",
            messageType: "geometry_msgs/Twist",
        })

        //We need to create a twist message to be to published to ROSbridge
    }

    handleStop(){
        console.log("Robot Stop");
    }

    render(){
        return (
            <div>
                <Joystick 
                size={100} 
                sticky={true} 
                baseColor="red" 
                stickColor="blue" 
                move={this.handleMove} 
                stop={this.handleStop}
                ></Joystick>

            </div>
        )
    }
}

export default Teleoperation;