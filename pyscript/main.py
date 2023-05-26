from hidden import SECRET
from hidden import CLIENT_ID
from hidden import PASS
from hidden import USER

from nrclex import NRCLex

import praw
import datetime


def getRefinedIndividualMoodDict(currMoodDict): # run in each submission iteration, end result should be only positive/negative
    refinedDict = {}
    IRREV_MODIFER = 0.75
    if(currMoodDict['positive'] > currMoodDict['negative']):
        # nullify anger and fear and sadness, anticipation
        # redirect 0.5 - 0.75 of surprise and joy to positive
        surpriseVal = 0
        if('surprise' in currMoodDict):
            surpriseVal = currMoodDict['surprise']

        joyVal = 0
        if('joy' in currMoodDict):
            joyVal = currMoodDict['joy']

        surpriseVal = int(surpriseVal * IRREV_MODIFER)
        joyVal = int(joyVal*IRREV_MODIFER)

        refinedDict['positive'] = currMoodDict['positive'] + surpriseVal + joyVal
        refinedDict['negative'] = currMoodDict['negative']
        return refinedDict
    elif(currMoodDict['positive'] < currMoodDict['negative']):
        # redirect anger and fear and sadness to negative (same rate as above)
        # nullify surprise and anticipation
        angerVal = 0
        if('anger' in currMoodDict):
            angerVal = int((currMoodDict['anger']) * IRREV_MODIFER)

        fearVal = 0
        if('fear' in currMoodDict):
            fearVal = int((currMoodDict['fear']) * IRREV_MODIFER)

        sadVal = 0
        if('sad' in currMoodDict):
            int((currMoodDict['sad']) * IRREV_MODIFER)

        refinedDict['positive'] = currMoodDict['positive']
        refinedDict['negative'] = currMoodDict['negative'] + angerVal + fearVal + sadVal

        return refinedDict
    else:
        # positive = negative,
        # nullify everything but positive and negative
        refinedDict['positive'] = currMoodDict['positive']
        refinedDict['negative'] = currMoodDict['negative']
        return refinedDict

def getMoodRatio(totalMoodDict):
    totalCount = 0
    ratioDict = {}
    for key in totalMoodDict:
        totalCount+=totalMoodDict[key]

    # perhaps setprecision to 2 float
    ratioDict['anger'] = totalMoodDict['anger'] / totalCount
    ratioDict['anticipation'] = totalMoodDict['anticipation'] / totalCount
    ratioDict['disgust'] = totalMoodDict['disgust'] / totalCount
    ratioDict['fear'] = totalMoodDict['fear'] / totalCount
    ratioDict['joy'] = totalMoodDict['joy'] / totalCount
    ratioDict['negative'] = totalMoodDict['negative'] / totalCount
    ratioDict['positive'] = totalMoodDict['positive'] / totalCount
    ratioDict['sadness'] = totalMoodDict['sadness'] / totalCount
    ratioDict['surprise'] = totalMoodDict['surprise'] / totalCount
    ratioDict['trust'] = totalMoodDict['trust'] / totalCount
    
    return ratioDict # positive needs to be knocked down in sensitivity. way too sensitive.
     
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
for submission in filter(lambda s: s.media is None and s.selftext != '', reddit.subreddit("wallstreetbets").new(limit=500)):
    i += 1
    
    submission_utc = submission.created_utc
    submission_date_time_string = str(datetime.datetime.fromtimestamp(submission_utc))
    submission_date_split = submission_date_time_string.split("-")
    submission_month = int(submission_date_split[1])
    submission_day = int(submission_date_split[2][0:2])
    emotion = NRCLex(submission.selftext)
    if('positive' not in emotion.raw_emotion_scores or 'negative' not in emotion.raw_emotion_scores):
        continue


    print("-------------------------------------------------")
    print("COUNT", i)
    
    print(submission.selftext)
    print(getRefinedIndividualMoodDict(emotion.raw_emotion_scores))
    

    # outfile.write(submission.selftext) 
    # dont really need this
    
    for key in emotion.raw_emotion_scores:
        if(key == 'trust'):
            continue
        elif(key not in totalMoodDict):
            totalMoodDict[key] = emotion.raw_emotion_scores[key]
        else:
            totalMoodDict[key] += emotion.raw_emotion_scores[key] 
print(totalMoodDict) # this works great.
outfile.close()


    #{'anticipation': 1581, 'negative': 1706, 'trust': 1582, 
    # 'anger': 744, 'positive': 2452, 'joy': 719, 'fear': 813, 'disgust': 295, 'sadness': 700, 'surprise': 533}



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

    
