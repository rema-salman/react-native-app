const express = require("express");
var cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const Twitter = require("twit");

const fs = require("fs");
const current = require("./data.json");
dotenv.config();

const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: "50mb" }));

// EndPoint (proxy) from client to twitter
app.post("/tweet", function (req, res, next) {
  // console.log(req.body.postPhoto);
  const twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY, // from Twitter.
    consumer_secret: process.env.TWITTER_API_KEY_SECRET, // from Twitter.
    access_token: process.env.TWITTER_ACCESS_TOKEN, // from your User (oauth_token)
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  //  CLIENT Body DATA date: tweet: postPhoto: userLocation:
  if (
    req.body.date === "" &&
    req.body.postPhoto === "" &&
    req.body.userLocation === {}
  ) {
    return res.status(400).json({
      msg: "NO TWEET WAS UPLOADED",
    });
  }
  // Tweetting a text and image together
  const b64content = req.body.postPhoto;

  // post the media to Twitter
  twitterClient.post(
    "media/upload",
    { media_data: b64content },
    function (err, data, response) {
      // assign alt text to the media, for use by screen readers and
      // other text-based presentations and interpreters
      var mediaIdStr = data.media_id_string;
      var meta_params = {
        media_id: mediaIdStr,
        alt_text: { text: req.body.tweet },
      };

      twitterClient.post(
        "media/metadata/create",
        meta_params,
        function (err, data, response) {
          if (!err) {
            //reference the media and post a tweet (media will attach to the tweet)
            var params = {
              status: req.body.tweet,
              media_ids: [mediaIdStr],
            };
            twitterClient.post(
              "statuses/update",
              params,
              function (err, data, response) {
                //  save data into a local file
                current.locallySavedTweets.push(req.body);
                fs.writeFile(
                  "data.json",
                  JSON.stringify(current, null, 4),
                  function (err) {
                    if (err) {
                      return console.log(err);
                    }
                    console.log("The file was saved!");
                    return res.json(data);
                  }
                );
              }
            );
          }
        }
      );
    }
  );
});

app.listen(5000, () => console.log("server started...."));
