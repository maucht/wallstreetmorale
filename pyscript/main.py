from hidden import SECRET
from hidden import CLIENT_ID
from hidden import PASS
from hidden import USER

from nrclex import NRCLex

import praw
import datetime

def isLessThanMonthOld(submissionMonth, submissionDay): # there really isnt any need for this anymore i think
    today = str(datetime.date.today())
    todaySplit = today.split("-")
    todayMonth = int(todaySplit[1])
    todayDay = int(todaySplit[2])

    #print(today)
    #print(todayMonth)
    #print(todayDay)  

    # need to cover edge case -- December to January



    if(todayMonth == submissionMonth): # if month == month (should never reach last year anyway)
        return True
    elif(abs(todayMonth-submissionMonth) == 1 and submissionDay > todayDay): # if last-ish month but less than a month old
        return True
    elif(submissionMonth == 12 and todayMonth == 1 and submissionDay > todayDay): # Case December...
         return True
    else:
        return False
def sameDay(submissionDay):
    today = str(datetime.date.today())
    todaySplit = today.split("-")
    todayDay = int(todaySplit[2])

    if(submissionDay == todayDay or submissionDay == (todayDay - 1)):
        return True
    else:
        return False

reddit = praw.Reddit(
    client_id=CLIENT_ID,
    client_secret=SECRET,
    user_agent="my user agent",
)
i=0

outfile = open('./submissioncontent.txt', 'w', encoding="utf-8")


totalMoodDict = {}
i = 0
for submission in filter(lambda s: s.media is None, reddit.subreddit("wallstreetbets").new(limit=500)):
    i += 1
    print("COUNT", i)
    submission_utc = submission.created_utc
    submission_date_time_string = str(datetime.datetime.fromtimestamp(submission_utc))
    submission_date_split = submission_date_time_string.split("-")
    submission_month = int(submission_date_split[1])
    submission_day = int(submission_date_split[2][0:2])



    print(submission_date_time_string)
    emotion = NRCLex(submission.selftext)
    print(emotion.raw_emotion_scores)
    print(submission.selftext)

    outfile.write(submission.selftext)
    
    for key in emotion.raw_emotion_scores:
        if(key not in totalMoodDict):
            totalMoodDict[key] = emotion.raw_emotion_scores[key]
        else:
            totalMoodDict[key] += emotion.raw_emotion_scores[key] 
    print(totalMoodDict) # this works great.

    #{'anticipation': 1581, 'negative': 1706, 'trust': 1582, 
    # 'anger': 744, 'positive': 2452, 'joy': 719, 'fear': 813, 'disgust': 295, 'sadness': 700, 'surprise': 533}
    

outfile.close()
# Successfully write to submissioncontent, on the root directory
# at this point run the emotion detection and send it to the backend
# frontend picks that data up and fills out a scale to the viewer
# ai in 3 days

# im thinking to calculate emotion score do the following:
# Take total count of posts
# Read each post individually and add score to respective variable score counts
# Take average at the end
# ???
# Profit.

# instead, i could collect the emotions in place, without having to iterate through the submission list from the outfile
# this would speed things up

# ultimately, this script needs to be a cron job, run every day

# create a case in the frontend where if there are 0 posts, set to neutral

    
