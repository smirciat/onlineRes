'use strict';

var fallbackEvents=['timeout','failed','unanswered','busy','rejected'];

export function answer(req, res) {
  console.log('answer')
  console.log(req.query)
  const ncco = [
    {
      "action": "connect",
      "timeout": 30,
      "from": req.query.from,
      "eventType": "synchronous",
      "endpoint": [
        {
          "type": "sip",
          "uri": "sip:19073022700@smokeybay.dynu.net:55511"
        }
      ]
    }
  ];
  res.json(ncco);
}

export function event(req, res) {
  console.log('event');
  console.log(req.body);
  if (fallbackEvents.indexOf(req.body.status)>-1) {
    const ncco = [
      {
        "action": "connect",
        "timeout": 15,
        "from": req.body.from,
        "eventType": "synchronous",
        "eventUrl": [
          "https://reservations.smokeybayair.com/api/answer/final-fallback"
        ],
        "endpoint": [
          {
            "type": "phone",
            "number": "+19072351511"
          }
        ]
      }
    ];
    res.json(ncco);
  }
  else res.status(204).end();
}

export function final(req, res) {
  console.log(req.body);
  if (fallbackEvents.indexOf(req.body.status)>-1) {
    const ncco = [
      {
        "action": "connect",
        "timeout": 60,
        "from": req.body.from,
        "eventType": "synchronous",
        "endpoint": [
          {
            "type": "phone",
            "number": "+19073992019"
          }
        ]
      }
    ];
    res.json(ncco);
  }
  else res.status(204).end();
}


