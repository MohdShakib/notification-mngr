"use strict";

const NotificationStore = {
  state: [], // here the notifications will be added
  addNotification: function (notification) {
    this.state.push(notification)
  },
  removeNotification: function (notification) {
    let notificationIndex = this.state.indexOf(notification);
    if(notificationIndex > -1){
        this.state.splice(notificationIndex,1);
    }
  }
}


export default NotificationStore;
