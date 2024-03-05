function StringHelper() {}

StringHelper.hasIvalidChars = (rawString) => {
  var iChars = "!@#$%^&*()+=-[]\\';,./{}|\":<>?";

  for (var i = 0; i < rawString; i++) {
    return iChars.indexOf(rawString.charAt(i)) != -1;
  }
};

StringHelper.simulateSuccessJson = (desc) => {
  return {
    nodes: [
      {
        name: "error",
        position: 0,
        group: 1,
        class: "app",
        dependencies: {},
      },
      {
        name: desc,
        position: 1,
        group: 1,
        class: "app",
        dependencies: {},
      },
    ],
    links: [
      {
        source: 0,
        target: 1,
        value: 1,
        type: "depends",
      },
    ],
  };
};

module.exports = StringHelper;
