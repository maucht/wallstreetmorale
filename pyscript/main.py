from hidden import SECRET
from hidden import CLIENT_ID
from hidden import PASS
from hidden import USER

import praw
import datetime

def isLessThanMonthOld(submissionMonth, submissionDay):
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


# COUNT IS LIMITED TO 100. THIS IS FUCKED.
for submission in reddit.subreddit("wallstreetbets").new():
    i+=1
    print("COUNT ",i)
    submissionUtc = submission.created_utc
    submissionDateTimeString = str(datetime.datetime.fromtimestamp(submissionUtc))
    submissionDateSplit = submissionDateTimeString.split("-")

    submissionMonth = int(submissionDateSplit[1])
    submissionDay = int(submissionDateSplit[2][0:2])
    print(submissionDateTimeString)
    print(submissionMonth)
    print(submissionDay)
    if(not isLessThanMonthOld(submissionMonth,submissionDay)):
        break
    
