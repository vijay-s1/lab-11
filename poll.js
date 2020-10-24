let poll = {
    question: "Vote For Your Favourite Component!",
    options: [
      { text: "Angular", count: 0 },
      { text: "MongoDB", count: 0 },
      { text: "Express.js", count: 0 },
      { text: "Golang", count: 0 },
      { text: "Python", count: 0 },
    ],
  };

  let colours = randomHexColours(poll.options.length)
  for (let i = 0; i < poll.options.length; i++) {
    poll.options[i].colour = colours[i]
  }

  function randomHexColours(numColours) {
    let colours = []
    let maxInnerLoops = 20
    for (let i = 0; i < numColours; i++) {
      var colourString = '#' + Math.floor(Math.random()*16777215).toString(16);
      let j = 0
      while (colours.includes(colourString) && j<= maxInnerLoops) {
        colourString = '#' + Math.floor(Math.random()*16777215).toString(16);
        j++;
      }
      colours.push(colourString)
    }
    return colours
  }

  module.exports = poll