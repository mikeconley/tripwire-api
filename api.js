console.log("parent.js is executing");

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

XPCOMUtils.defineLazyModuleGetter(this, "ExtensionCommon",
                                  "resource://gre/modules/ExtensionCommon.jsm");

class API extends ExtensionAPI {
  getAPI(context) {
  	return {
	  tripwire: {
	  	onViolation: new ExtensionCommon.EventManager(context, "experiments.tripwire", fire => {
	  	  let observer = msg => {
	  	  	fire.async(msg.data.stack);
	  	  };
	  	  Services.ppmm.addMessageListener("Tripwire:opp-violation", observer);
	      return () => {
	      	Services.ppmm.removeMessageListener("Tripwire:opp-violation", observer);
	      }
	  	}).api()
	  }
  	}
  }
}

console.log("parent.js finished executing");