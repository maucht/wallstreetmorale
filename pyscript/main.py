from hidden import SECRET
from hidden import CLIENT_ID
from hidden import PASS
from hidden import USER

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

reddit = praw.Reddit(
    client_id=CLIENT_ID,
    client_secret=SECRET,
    user_agent="my user agent",
)
i=0

outfile = open('./submissioncontent.txt', 'a', encoding="utf-8")

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
    print(submission_month)
    print(submission_day)
    print(submission.selftext)
    outfile.write(submission.selftext)

outfile.close()
# Successfully write to submissioncontent, on the root directory
# at this point run the emotion detection and send it to the backend
# frontend picks that data up and fills out a scale to the viewer
# ai in 3 days

    
