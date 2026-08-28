import { schema } from 'prosemirror-schema-basic';
import { Step } from 'prosemirror-transform';

const STEPS_FIXTURE = [
  {
    stepType: "replace",
    from: 1,
    to: 1,
    slice: {
      content: [
        {
          type: "text",
          text: "I"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 2,
    to: 2,
    slice: {
      content: [
        {
          type: "text",
          text: "s"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 3,
    to: 3,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 4,
    to: 4,
    slice: {
      content: [
        {
          type: "text",
          text: "t"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 5,
    to: 5,
    slice: {
      content: [
        {
          type: "text",
          text: "h"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 6,
    to: 6,
    slice: {
      content: [
        {
          type: "text",
          text: "i"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 7,
    to: 7,
    slice: {
      content: [
        {
          type: "text",
          text: "s"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 8,
    to: 8,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 9,
    to: 9,
    slice: {
      content: [
        {
          type: "text",
          text: "t"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 10,
    to: 10,
    slice: {
      content: [
        {
          type: "text",
          text: "h"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 11,
    to: 11,
    slice: {
      content: [
        {
          type: "text",
          text: "e"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 12,
    to: 12,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 13,
    to: 13,
    slice: {
      content: [
        {
          type: "text",
          text: "r"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 14,
    to: 14,
    slice: {
      content: [
        {
          type: "text",
          text: "e"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 15,
    to: 15,
    slice: {
      content: [
        {
          type: "text",
          text: "e"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 16,
    to: 16,
    slice: {
      content: [
        {
          type: "text",
          text: "l"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 17,
    to: 17,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 18,
    to: 18,
    slice: {
      content: [
        {
          type: "text",
          text: "l"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 19,
    to: 19,
    slice: {
      content: [
        {
          type: "text",
          text: "i"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 20,
    to: 20,
    slice: {
      content: [
        {
          type: "text",
          text: "f"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 21,
    to: 21,
    slice: {
      content: [
        {
          type: "text",
          text: "e"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 22,
    to: 22,
    slice: {
      content: [
        {
          type: "text",
          text: "?"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 23,
    to: 23,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 24,
    to: 24,
    slice: {
      content: [
        {
          type: "text",
          text: "I"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 25,
    to: 25,
    slice: {
      content: [
        {
          type: "text",
          text: "s"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 26,
    to: 26,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 27,
    to: 27,
    slice: {
      content: [
        {
          type: "text",
          text: "t"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 28,
    to: 28,
    slice: {
      content: [
        {
          type: "text",
          text: "h"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 29,
    to: 29,
    slice: {
      content: [
        {
          type: "text",
          text: "i"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 30,
    to: 30,
    slice: {
      content: [
        {
          type: "text",
          text: "s"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 31,
    to: 31,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 32,
    to: 32,
    slice: {
      content: [
        {
          type: "text",
          text: "j"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 33,
    to: 33,
    slice: {
      content: [
        {
          type: "text",
          text: "u"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 34,
    to: 34,
    slice: {
      content: [
        {
          type: "text",
          text: "s"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 35,
    to: 35,
    slice: {
      content: [
        {
          type: "text",
          text: "t"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 36,
    to: 36,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 37,
    to: 37,
    slice: {
      content: [
        {
          type: "text",
          text: "f"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 38,
    to: 38,
    slice: {
      content: [
        {
          type: "text",
          text: "a"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 39,
    to: 39,
    slice: {
      content: [
        {
          type: "text",
          text: "n"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 40,
    to: 40,
    slice: {
      content: [
        {
          type: "text",
          text: "t"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 41,
    to: 41,
    slice: {
      content: [
        {
          type: "text",
          text: "a"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 42,
    to: 42,
    slice: {
      content: [
        {
          type: "text",
          text: "z"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 43,
    to: 43,
    slice: {
      content: [
        {
          type: "text",
          text: "y"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 44,
    to: 44,
    slice: {
      content: [
        {
          type: "text",
          text: "?"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 45,
    to: 45,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 46,
    to: 46,
    slice: {
      content: [
        {
          type: "text",
          text: "C"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 47,
    to: 47,
    slice: {
      content: [
        {
          type: "text",
          text: "V"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 47,
    to: 48
  },
  {
    stepType: "replace",
    from: 47,
    to: 47,
    slice: {
      content: [
        {
          type: "text",
          text: "a"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 48,
    to: 48,
    slice: {
      content: [
        {
          type: "text",
          text: "u"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 49,
    to: 49,
    slice: {
      content: [
        {
          type: "text",
          text: "g"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 50,
    to: 50,
    slice: {
      content: [
        {
          type: "text",
          text: "h"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 51,
    to: 51,
    slice: {
      content: [
        {
          type: "text",
          text: "t"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 52,
    to: 52,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 53,
    to: 53,
    slice: {
      content: [
        {
          type: "text",
          text: "i"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 54,
    to: 54,
    slice: {
      content: [
        {
          type: "text",
          text: "n"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 55,
    to: 55,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 56,
    to: 56,
    slice: {
      content: [
        {
          type: "text",
          text: "a"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 57,
    to: 57,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 58,
    to: 58,
    slice: {
      content: [
        {
          type: "text",
          text: "l"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 59,
    to: 59,
    slice: {
      content: [
        {
          type: "text",
          text: "a"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 60,
    to: 60,
    slice: {
      content: [
        {
          type: "text",
          text: "n"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 61,
    to: 61,
    slice: {
      content: [
        {
          type: "text",
          text: "d"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 62,
    to: 62,
    slice: {
      content: [
        {
          type: "text",
          text: "s"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 63,
    to: 63,
    slice: {
      content: [
        {
          type: "text",
          text: "l"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 64,
    to: 64,
    slice: {
      content: [
        {
          type: "text",
          text: "i"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 65,
    to: 65,
    slice: {
      content: [
        {
          type: "text",
          text: "d"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 66,
    to: 66,
    slice: {
      content: [
        {
          type: "text",
          text: "e"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 67,
    to: 67,
    slice: {
      content: [
        {
          type: "text",
          text: ","
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 68,
    to: 68,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 69,
    to: 69,
    slice: {
      content: [
        {
          type: "text",
          text: "n"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 70,
    to: 70,
    slice: {
      content: [
        {
          type: "text",
          text: "o"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 71,
    to: 71,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 72,
    to: 72,
    slice: {
      content: [
        {
          type: "text",
          text: "e"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 73,
    to: 73,
    slice: {
      content: [
        {
          type: "text",
          text: "x"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 73,
    to: 74
  },
  {
    stepType: "replace",
    from: 73,
    to: 73,
    slice: {
      content: [
        {
          type: "text",
          text: "s"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 74,
    to: 74,
    slice: {
      content: [
        {
          type: "text",
          text: "c"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 75,
    to: 75,
    slice: {
      content: [
        {
          type: "text",
          text: "a"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 76,
    to: 76,
    slice: {
      content: [
        {
          type: "text",
          text: "p"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 77,
    to: 77,
    slice: {
      content: [
        {
          type: "text",
          text: "e"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 78,
    to: 78,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 79,
    to: 79,
    slice: {
      content: [
        {
          type: "text",
          text: "f"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 80,
    to: 80,
    slice: {
      content: [
        {
          type: "text",
          text: "r"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 81,
    to: 81,
    slice: {
      content: [
        {
          type: "text",
          text: "o"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 82,
    to: 82,
    slice: {
      content: [
        {
          type: "text",
          text: "m"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 83,
    to: 83,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 84,
    to: 84,
    slice: {
      content: [
        {
          type: "text",
          text: "r"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 85,
    to: 85,
    slice: {
      content: [
        {
          type: "text",
          text: "e"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 86,
    to: 86,
    slice: {
      content: [
        {
          type: "text",
          text: "a"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 87,
    to: 87,
    slice: {
      content: [
        {
          type: "text",
          text: "l"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 88,
    to: 88,
    slice: {
      content: [
        {
          type: "text",
          text: "i"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 89,
    to: 89,
    slice: {
      content: [
        {
          type: "text",
          text: "t"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 90,
    to: 90,
    slice: {
      content: [
        {
          type: "text",
          text: "y"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 45,
    to: 46
  },
  {
    stepType: "replace",
    from: 45,
    to: 45,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 91,
    to: 91,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 92,
    to: 92,
    slice: {
      content: [
        {
          type: "text",
          text: "o"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 93,
    to: 93,
    slice: {
      content: [
        {
          type: "text",
          text: "p"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 94,
    to: 94,
    slice: {
      content: [
        {
          type: "text",
          text: "e"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 95,
    to: 95,
    slice: {
      content: [
        {
          type: "text",
          text: "n"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 96,
    to: 96,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 97,
    to: 97,
    slice: {
      content: [
        {
          type: "text",
          text: "y"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 98,
    to: 98,
    slice: {
      content: [
        {
          type: "text",
          text: "o"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 99,
    to: 99,
    slice: {
      content: [
        {
          type: "text",
          text: "u"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 100,
    to: 100,
    slice: {
      content: [
        {
          type: "text",
          text: "r"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 101,
    to: 101,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 102,
    to: 102,
    slice: {
      content: [
        {
          type: "text",
          text: "e"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 103,
    to: 103,
    slice: {
      content: [
        {
          type: "text",
          text: "y"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 104,
    to: 104,
    slice: {
      content: [
        {
          type: "text",
          text: "e"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 105,
    to: 105,
    slice: {
      content: [
        {
          type: "text",
          text: "s"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 106,
    to: 106,
    slice: {
      content: [
        {
          type: "text",
          text: ","
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 107,
    to: 107,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 108,
    to: 108,
    slice: {
      content: [
        {
          type: "text",
          text: "l"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 109,
    to: 109,
    slice: {
      content: [
        {
          type: "text",
          text: "o"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 110,
    to: 110,
    slice: {
      content: [
        {
          type: "text",
          text: "o"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 111,
    to: 111,
    slice: {
      content: [
        {
          type: "text",
          text: "k"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 112,
    to: 112,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 113,
    to: 113,
    slice: {
      content: [
        {
          type: "text",
          text: "u"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 114,
    to: 114,
    slice: {
      content: [
        {
          type: "text",
          text: "p"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 115,
    to: 115,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 116,
    to: 116,
    slice: {
      content: [
        {
          type: "text",
          text: "t"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 117,
    to: 117,
    slice: {
      content: [
        {
          type: "text",
          text: "o"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 118,
    to: 118,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 119,
    to: 119,
    slice: {
      content: [
        {
          type: "text",
          text: "t"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 120,
    to: 120,
    slice: {
      content: [
        {
          type: "text",
          text: "h"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 121,
    to: 121,
    slice: {
      content: [
        {
          type: "text",
          text: "e"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 122,
    to: 122,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 123,
    to: 123,
    slice: {
      content: [
        {
          type: "text",
          text: "s"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 124,
    to: 124,
    slice: {
      content: [
        {
          type: "text",
          text: "k"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 125,
    to: 125,
    slice: {
      content: [
        {
          type: "text",
          text: "y"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 126,
    to: 126,
    slice: {
      content: [
        {
          type: "text",
          text: "e"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 127,
    to: 127,
    slice: {
      content: [
        {
          type: "text",
          text: "s"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 128,
    to: 128,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 129,
    to: 129,
    slice: {
      content: [
        {
          type: "text",
          text: "a"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 130,
    to: 130,
    slice: {
      content: [
        {
          type: "text",
          text: "n"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 131,
    to: 131,
    slice: {
      content: [
        {
          type: "text",
          text: "d"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 132,
    to: 132,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 133,
    to: 133,
    slice: {
      content: [
        {
          type: "text",
          text: "s"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 134,
    to: 134,
    slice: {
      content: [
        {
          type: "text",
          text: "e"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 135,
    to: 135,
    slice: {
      content: [
        {
          type: "text",
          text: "e"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 136,
    to: 136,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 137,
    to: 137,
    slice: {
      content: [
        {
          type: "text",
          text: "I"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 138,
    to: 138,
    slice: {
      content: [
        {
          type: "text",
          text: "'"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 139,
    to: 139,
    slice: {
      content: [
        {
          type: "text",
          text: "m"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 140,
    to: 140,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 141,
    to: 141,
    slice: {
      content: [
        {
          type: "text",
          text: "j"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 142,
    to: 142,
    slice: {
      content: [
        {
          type: "text",
          text: "u"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 143,
    to: 143,
    slice: {
      content: [
        {
          type: "text",
          text: "s"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 144,
    to: 144,
    slice: {
      content: [
        {
          type: "text",
          text: "t"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 145,
    to: 145,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 146,
    to: 146,
    slice: {
      content: [
        {
          type: "text",
          text: "a"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 147,
    to: 147,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 148,
    to: 148,
    slice: {
      content: [
        {
          type: "text",
          text: "p"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 149,
    to: 149,
    slice: {
      content: [
        {
          type: "text",
          text: "o"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 150,
    to: 150,
    slice: {
      content: [
        {
          type: "text",
          text: "o"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 151,
    to: 151,
    slice: {
      content: [
        {
          type: "text",
          text: "r"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 152,
    to: 152,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 153,
    to: 153,
    slice: {
      content: [
        {
          type: "text",
          text: "b"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 154,
    to: 154,
    slice: {
      content: [
        {
          type: "text",
          text: "o"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 155,
    to: 155,
    slice: {
      content: [
        {
          type: "text",
          text: "y"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 156,
    to: 156,
    slice: {
      content: [
        {
          type: "text",
          text: ","
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 157,
    to: 157,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 158,
    to: 158,
    slice: {
      content: [
        {
          type: "text",
          text: "I"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 159,
    to: 159,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 160,
    to: 160,
    slice: {
      content: [
        {
          type: "text",
          text: "n"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 161,
    to: 161,
    slice: {
      content: [
        {
          type: "text",
          text: "e"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 162,
    to: 162,
    slice: {
      content: [
        {
          type: "text",
          text: "e"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 163,
    to: 163,
    slice: {
      content: [
        {
          type: "text",
          text: "d"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 164,
    to: 164,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 165,
    to: 165,
    slice: {
      content: [
        {
          type: "text",
          text: "n"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 166,
    to: 166,
    slice: {
      content: [
        {
          type: "text",
          text: "o"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 167,
    to: 167,
    slice: {
      content: [
        {
          type: "text",
          text: " "
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 168,
    to: 168,
    slice: {
      content: [
        {
          type: "text",
          text: "s"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 169,
    to: 169,
    slice: {
      content: [
        {
          type: "text",
          text: "y"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 170,
    to: 170,
    slice: {
      content: [
        {
          type: "text",
          text: "n"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 170,
    to: 171
  },
  {
    stepType: "replace",
    from: 170,
    to: 170,
    slice: {
      content: [
        {
          type: "text",
          text: "m"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 171,
    to: 171,
    slice: {
      content: [
        {
          type: "text",
          text: "p"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 172,
    to: 172,
    slice: {
      content: [
        {
          type: "text",
          text: "a"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 173,
    to: 173,
    slice: {
      content: [
        {
          type: "text",
          text: "t"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 174,
    to: 174,
    slice: {
      content: [
        {
          type: "text",
          text: "h"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 175,
    to: 175,
    slice: {
      content: [
        {
          type: "text",
          text: "y"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 15,
    to: 16,
    slice: {
      content: [
        {
          type: "text",
          text: "a"
        }
      ]
    }
  },
  {
    stepType: "replace",
    from: 42,
    to: 43,
    slice: {
      content: [
        {
          type: "text",
          text: "s"
        }
      ]
    }
  }
].map(step => Step.fromJSON(schema, step));

export { STEPS_FIXTURE };