
class Exceptions {

  deleteDrawException = (techDesc) => {
    return `Failed to delete draw.
     Draw may contain games in bracket event connected to other games. 
     Make sure to delete draws from oldest to newest.
     Technical Description: ${techDesc}`;
  };
}

module.exports = Exceptions;

