from flask import Flask, session, jsonify, request
from bs4 import BeautifulSoup
from urllib import parse
import requests
from flask_cors import CORS
from datetime import datetime
app = Flask(__name__)

CORS(app, supports_credentials=True, origins="*")
app.config['SECRET_KEY'] = 'testKey'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_COOKIE_DOMAIN'] = None
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'


@app.route('/testSession', methods = ['GET'])
def testSession():
    cookie_dicts = session.get("testKey")
    print(cookie_dicts)
    #print(cookie_dicts['.AuthCookie'])
    requestSession = requests.session()
    current_url = "https://lis-hac.eschoolplus.powerschool.com/HomeAccess/"  # Replace with the actual current URL
    # Prepare the _nocache parameter (to mimic 1 * new Date() in JavaScript)
    nocache_param = int(datetime.now().timestamp() * 1000)
    # Make the GET request
    response = requestSession.get(current_url, params={'_nocache': nocache_param}, cookies = cookie_dicts).text
    parser =  BeautifulSoup(response, "lxml")
    cookie_dict = {cookie.name: cookie.value for cookie in requestSession.cookies}
    print(cookie_dict)
    cookie_dicts.update(cookie_dict)
    print(cookie_dicts)
    session['testKey'] = cookie_dicts;
    return "done"

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    requestSession = requests.session()
    loginScreenResponse = requestSession.get("https://lis-hac.eschoolplus.powerschool.com/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2f").text

    parser =  BeautifulSoup(loginScreenResponse, "lxml")

    requestVerificationToken = parser.find('input', attrs={'name': '__RequestVerificationToken'})["value"]

    requestHeaders = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Host': 'lis-hac.eschoolplus.powerschool.com',
        'Origin': 'lis-hac.eschoolplus.powerschool.com',
        'Referer': "https://lis-hac.eschoolplus.powerschool.com/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2f",
        '__RequestVerificationToken': requestVerificationToken 
    } 

    requestPayload = {
        "__RequestVerificationToken" : requestVerificationToken,
        "SCKTY00328510CustomEnabled" : "False",
        "SCKTY00436568CustomEnabled" : "False",
        "Database" : "10",
        "VerificationOption" : "UsernamePassword",
        "LogOnDetails.UserName": username,
        "tempUN" : "",
        "tempPW" : "",
        "LogOnDetails.Password" : password
    }

    requestSession.post(
        "https://lis-hac.eschoolplus.powerschool.com/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2f",
        data=requestPayload,
        headers=requestHeaders
    )
    cookie_dict = {cookie.name: cookie.value for cookie in requestSession.cookies}
    print(cookie_dict)
    session['testKey'] = cookie_dict;
    return jsonify({"completed": "True"})    

@app.route('/relogin', methods=['GET'])
def relogin():
    # print("running")
    # cookie_dict = session.get("testKey")
    # username = cookie_dict.get("username")
    # password = cookie_dict.get("password")
    # requestSession = requests.session()

    # loginScreenResponse = requestSession.get("https://lis-hac.eschoolplus.powerschool.com/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2f").text

    # parser =  BeautifulSoup(loginScreenResponse, "lxml")

    # requestVerificationToken = parser.find('input', attrs={'name': '__RequestVerificationToken'})["value"]

    # requestHeaders = {
    #     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36',
    #     'X-Requested-With': 'XMLHttpRequest',
    #     'Host': 'lis-hac.eschoolplus.powerschool.com',
    #     'Origin': 'lis-hac.eschoolplus.powerschool.com',
    #     'Referer': "https://lis-hac.eschoolplus.powerschool.com/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2f",
    #     '__RequestVerificationToken': requestVerificationToken
    # } 

    # requestPayload = {
    #     "__RequestVerificationToken" : requestVerificationToken,
    #     "SCKTY00328510CustomEnabled" : "False",
    #     "SCKTY00436568CustomEnabled" : "False",
    #     "Database" : "10",
    #     "VerificationOption" : "UsernamePassword",
    #     "LogOnDetails.UserName": username,
    #     "tempUN" : "",
    #     "tempPW" : "",
    #     "LogOnDetails.Password" : password
    # }

    # requestSession.post(
    #     "https://lis-hac.eschoolplus.powerschool.com/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2f",
    #     data=requestPayload,
    #     headers=requestHeaders
    # )
    # cookie_dict = {cookie.name: cookie.value for cookie in requestSession.cookies}
    # cookie_dict.update({"username": username, "password": password})
    # session['testKey'] = cookie_dict;
    # return jsonify({"completed": "True"}) 
    cookie_dicts = session.get("testKey")
    print(cookie_dicts)
    #print(cookie_dicts['.AuthCookie'])
    requestSession = requests.session()
    current_url = "https://lis-hac.eschoolplus.powerschool.com/HomeAccess/"  # Replace with the actual current URL
    # Prepare the _nocache parameter (to mimic 1 * new Date() in JavaScript)
    nocache_param = int(datetime.now().timestamp() * 1000)
    # Make the GET request
    response = requestSession.get(current_url, params={'_nocache': nocache_param}, cookies = cookie_dicts).text
    parser =  BeautifulSoup(response, "lxml")
    cookie_dict = {cookie.name: cookie.value for cookie in requestSession.cookies}
    print(cookie_dict)
    cookie_dicts.update(cookie_dict)
    print(cookie_dicts)
    session['testKey'] = cookie_dicts;
    return "done"

@app.route('/teachers', methods=['GET'])
def teachers():
    cookie_dict = session.get("testKey")
    teachersPageContent = requests.get('https://lis-hac.eschoolplus.powerschool.com/HomeAccess/Content/Student/Classes.aspx', cookies = cookie_dict).text
    parser = BeautifulSoup(teachersPageContent, "lxml")
    divs = parser.find_all("div", "sg-content-grid")
    teachers = []
    seen_classes = set() # To keep track of classes that have already been added
    for div in divs:
        rows = div.find_all("tr", "sg-asp-table-data-row")
        for row in rows:
            class_name = row.find_all('td')[1].text.strip() # Class information is in the second cell
            teacher_cell = row.find_all('td')[3] # Teacher information is in the fourth cell
            name = teacher_cell.text.strip()
            email_link = teacher_cell.find('a')['href'] if teacher_cell.find('a') else None

            # Only add the entry if this class has not been seen before
            if class_name not in seen_classes:
                teachers.append({'name': name, 'email': email_link, 'class': class_name, 'imageUrl' : 'https://images.squarespace-cdn.com/content/v1/5b56c01f9f877051fa238ca3/1573759915619-1LGAQ3NCIULHNEZ1OY87/Ray.jpg'})
                seen_classes.add(class_name) # Mark this class as seen
    
    return jsonify({"teachers": teachers})

@app.route('/schedule', methods = ['GET'])
def schedule():
    cookie_dict = session.get("testKey")    
    teachersPageContent = requests.get('https://lis-hac.eschoolplus.powerschool.com/HomeAccess/Content/Student/Classes.aspx', cookies = cookie_dict).text
    parser = BeautifulSoup(teachersPageContent, "lxml")
    schedule_data = []
    table = parser.find('table', {'id': 'plnMain_dgSchedule'})
    rows = table.find_all('tr')
    for row in rows[1:]: # Skipping the header row
        columns = row.find_all('td')
        schedule_item = {
            'course': columns[0].text.strip(),
            'description': columns[1].text.strip(),
            'period': columns[2].text.strip(),
            'teacher': columns[3].text.strip(),
            'room': columns[4].text.strip(),
            'days': columns[5].text.strip(),
            'marking Periods': columns[6].text.strip(),
            'building': columns[7].text.strip(),
            'status': columns[8].text.strip()
        }
        schedule_data.append(schedule_item)

    return jsonify({"schedule": schedule_data}) 
   
# @app.route('/gradesTest', methods=['GET'])
# def gradesTest():
#     dic = dict(parse.parse_qsl(parse.urlsplit(request.url).query))
#     username = dic["username"]
#     password = dic["password"]
#     session2 = getRequestSession('sujithkumar.alluru97@k12.leanderisd.org', 'Password123!')
#     coursesPageContent = session2.get("https://lis-hac.eschoolplus.powerschool.com/HomeAccess/Content/Student/Assignments.aspx")
#     print(coursesPageContent.text)
#     return jsonify({"currentClasses": coursesPageContent})

@app.route('/grades', methods=['GET'])
def grades():
    cookie_dict_test = session.get("testKey")
    print(cookie_dict_test)
    # print(cookie_dict_test)
    # cookie_dict = request.json.get('cookies')
    requestSession = requests.session()
    coursesPageContent = requestSession.get('https://lis-hac.eschoolplus.powerschool.com/HomeAccess/Content/Student/Assignments.aspx', cookies = cookie_dict_test).text
    cookie_dic = {cookie.name: cookie.value for cookie in requestSession.cookies}
    parser = BeautifulSoup(coursesPageContent, "lxml")
    courses = []
    courseContainer = parser.find_all("div", "AssignmentClass")
    classNum = 0
    for container in courseContainer:
        newCourse = {
            "name": "",
            "grade": "",
            "lastUpdated": "",
            "assignments": [],
            "categories": []
        }
        parser = BeautifulSoup(
            f"<html><body>{container}</body></html>", "lxml")
        headerContainer = parser.find_all(
            "div", "sg-header sg-header-square")
        assignmentsContainer = parser.find_all("div", "sg-content-grid")
        for hc in headerContainer:
            parser = BeautifulSoup(
                f"<html><body>{hc}</body></html>", "lxml")

            newCourse["name"] = parser.find(
                "a", "sg-header-heading").text.strip()

            newCourse["lastUpdated"] = parser.find(
                "span", "sg-header-sub-heading").text.strip().replace("(Last Updated: ", "").replace(")", "")

            
        for ac in assignmentsContainer:
            parser = BeautifulSoup(
                f"<html><body>{ac}</body></html>", "lxml")
            rows = parser.find_all("tr", "sg-asp-table-data-row")
            clearFix = parser.find_all('div', 'sg-view-quick sg-clearfix')
            findClearFix = BeautifulSoup(f"<html><body>{clearFix}</body></html>", "lxml").find('span', {'id': 'plnMain_rptAssigmnetsByCourse_lblOverallAverage_' + str(classNum)})
            if findClearFix:
                newCourse["grade"] = findClearFix.text.strip()
            else:
                newCourse["grade"] = "0.00"
            findCategories = BeautifulSoup(f"<html><body>{clearFix}</body></html>", "lxml").find('table', 'sg-asp-table')
            categories = BeautifulSoup(
                f"<html><body>{findCategories}</body></html>", "lxml").find_all('tr', 'sg-asp-table-data-row')
            for category in categories:
                Twotds = BeautifulSoup(f"<html><body>{category}</body></html>", "lxml").find_all("td")
                categoryName = Twotds[0].text.strip()
                categoryPercentage = Twotds[3].text.strip()
                categoryWeight = Twotds[4].text.strip()
                newCourse["categories"].append(
                    {"name": categoryName,
                      "weight": categoryWeight,
                      "categoryPercent": categoryPercentage})
            for assignmentContainer in rows:
                try:
                    parser = BeautifulSoup(
                        f"<html><body>{assignmentContainer}</body></html>", "lxml")
                    tds = parser.find_all("td")
                    assignmentName = parser.find("a").text.strip()
                    assignmentDateDue = tds[0].text.strip()
                    assignmentDateAssigned = tds[1].text.strip()
                    assignmentCategory = tds[3].text.strip()
                    assignmentScore = tds[4].text.strip()
                    assignmentTotalPoints = tds[5].text.strip()
                    assignmentWeight = tds[6].text.strip()
                    assignmentPercentage = tds[9].text.strip()
                    isDr = str(tds[4])
                    newCourse["assignments"].append(
                        {
                            "name": assignmentName,
                            "category": assignmentCategory,
                            "dateAssigned": assignmentDateAssigned,
                            "dateDue": assignmentDateDue,
                            "score": assignmentScore,
                            "totalPoints": assignmentTotalPoints,
                            "weight": assignmentWeight,
                            "assignmentPercentage": assignmentPercentage,
                            "isDr": isDr
                        }
                    )
                    
                except:
                    pass

            courses.append(newCourse)
        classNum = classNum + 1
    return jsonify({"currentClasses": courses})

@app.route('/attendance', methods=['GET'])
def attendance():
    dic = dict(parse.parse_qsl(parse.urlsplit(request.url).query))
    goalMonth = dic["month"].casefold()
    cookie_dict = session.get("testKey")
    print(cookie_dict)
    # dic = dict(parse.parse_qsl(parse.urlsplit(request.url).query))
    # monthMethod = dic["monthMethod"]
    requestSession = requests.Session()
    attendancePage = requestSession.get('https://lis-hac.eschoolplus.powerschool.com/HomeAccess/Content/Attendance/MonthlyView.aspx', cookies = cookie_dict)
    attendancePageContext = attendancePage.text
    html_content = BeautifulSoup(attendancePageContext, 'lxml')
    preData = html_content.find_all("table", "sg-asp-calendar-header")[0].find_all("td")
    month = preData[1].text.split(" ")[0].casefold()
    if(goalMonth == "current"):
        goalMonth = month
    html_content = getMonthData(goalMonth, cookie_dict)
    try:
        table = html_content.find_all("table", "sg-asp-calendar")
        tableheader = html_content.find_all("table", "sg-asp-calendar-header")
        tdhs = tableheader[0].find_all("td")
        month = tdhs[1].text
        tds = table[0].find_all("td")
        data = []
        for td in tds:
            text = td.text.strip()
            if text.isdigit() and 1 <= int(text) <= 31:
                title = td.get('title', '')
                style = td.get('style', '')
                data.append({'day': text, 'attendance': title, 'color': style})


    except:
        data = ["failed"]
    return jsonify({"data": data, "monthNow": month})

def getMonthData(goal, cookies):
    requestSession = requests.Session()
    attendancePage = requestSession.get('https://lis-hac.eschoolplus.powerschool.com/HomeAccess/Content/Attendance/MonthlyView.aspx', cookies = cookies)
    attendancePageContext = attendancePage.text
    html_content = BeautifulSoup(attendancePageContext, 'lxml')
    preData = html_content.find_all("table", "sg-asp-calendar-header")[0].find_all("td")
    backMonth = preData[0].find('a')['href'].split("'")[3] if preData[0].text else None
    forwardMonth = preData[2].find('a')['href'].split("'")[3] if preData[2].text else None
    month = preData[1].text.split(" ")[0].casefold()
    viewState = html_content.find('input', {'name': '__VIEWSTATE'}).get('value')
    viewStateGen = html_content.find('input', {'name': '__VIEWSTATEGENERATOR'}).get('value')
    eventValidation = html_content.find('input', {'name': '__EVENTVALIDATION'}).get('value')
    requestHeaders = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
       "Content-Type": "application/x-www-form-urlencoded",
       "Referer": "https://lis-hac.eschoolplus.powerschool.com/HomeAccess/Content/Attendance/MonthlyView.aspx",
       "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
       "Accept-Encoding": "gzip, deflate, br",
       "Accept-Language": "en-US,en;q=0.9",
       "Connection": "keep-alive",
       "Host": "lis-hac.eschoolplus.powerschool.com",
       "Connection": "keep-alive"
    } 
    
    requestPayload = {
        '__EVENTTARGET': 'ctl00$plnMain$cldAttendance',
        '__EVENTARGUMENT': '',
        '__VIEWSTATE': viewState,
        '__VIEWSTATEGENERATOR': viewStateGen,
        '__EVENTVALIDATION': eventValidation,
        'ctl00$plnMain$hdnValidMHACLicense': 'Y',
        'ctl00$plnMain$hdnMultipleAttendenceCodes': 'Multiple Attendance Codes',
        'ctl00$plnMain$hdnSchoolClosed': 'School Closed',
        'ctl00$plnMain$hdnLegendNoCodes': 'Attendance Codes could not be found.',
        'ctl00$plnMain$hdnHyperlinkText_exist': '(Alerts Are Limited. Click to View List of Selected Choices.)',
        'ctl00$plnMain$hdnHyperlinkText_Noexist': '(Limit Alerts to Specific Types of Attendance)'
    }
    
    months = {
        "january": 6,
        "february": 7,
        "march": 8,
        "april": 9,
        "may": 10,
        "june": 11,
        "july": 12,
        "august": 1,
        "september": 2,
        "october": 3,
        "november": 4,
        "december": 5,
    }
    goalMonth = months[goal]
    currentMonth = months[month]
    if(goalMonth>currentMonth):
        requestPayload['__EVENTARGUMENT'] = forwardMonth
        for i in range(goalMonth - currentMonth):
            attendancePageContext = requestSession.post('https://lis-hac.eschoolplus.powerschool.com/HomeAccess/Content/Attendance/MonthlyView.aspx', data=requestPayload, headers=requestHeaders, cookies = cookies).text
            html_content = BeautifulSoup(attendancePageContext, 'lxml')
            preData = html_content.find_all("table", "sg-asp-calendar-header")[0].find_all("td")
            action = preData[2].find('a')['href'].split("'")[3] if preData[2].text else None
            requestPayload['__EVENTARGUMENT'] = action
            requestPayload['__VIEWSTATE'] = html_content.find('input', {'name': '__VIEWSTATE'}).get('value')
            requestPayload['__VIEWSTATEGENERATOR'] = html_content.find('input', {'name': '__VIEWSTATEGENERATOR'}).get('value')
            requestPayload['__EVENTVALIDATION'] = html_content.find('input', {'name': '__EVENTVALIDATION'}).get('value')
        return html_content
    elif(goalMonth<currentMonth):
        requestPayload['__EVENTARGUMENT'] = backMonth
        for i in range(currentMonth - goalMonth):
            attendancePageContext = requestSession.post('https://lis-hac.eschoolplus.powerschool.com/HomeAccess/Content/Attendance/MonthlyView.aspx', data=requestPayload, headers=requestHeaders, cookies = cookies).text
            html_content = BeautifulSoup(attendancePageContext, 'lxml')
            preData = html_content.find_all("table", "sg-asp-calendar-header")[0].find_all("td")
            action = preData[0].find('a')['href'].split("'")[3] if preData[2].text else None
            requestPayload['__EVENTARGUMENT'] = action
            requestPayload['__VIEWSTATE'] = html_content.find('input', {'name': '__VIEWSTATE'}).get('value')
            requestPayload['__VIEWSTATEGENERATOR'] = html_content.find('input', {'name': '__VIEWSTATEGENERATOR'}).get('value')
            requestPayload['__EVENTVALIDATION'] = html_content.find('input', {'name': '__EVENTVALIDATION'}).get('value')
        return html_content
    else:
        return html_content


@app.route('/news', methods=['GET'])
def news():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    newsPageText = requests.get('https://news.leanderisd.org', headers=headers).text
    soup = BeautifulSoup(newsPageText, 'lxml')

    # Extracting titles and links
    titles_elements = soup.select("div.item-data")
    links_elements = soup.select("a.wpp-post-title")
    
    links_and_titles = [(link['href'], title.text) for link, title in zip(links_elements, titles_elements)]

    news_items = []
    for link_url, title_text in links_and_titles:
        article_page = requests.get(link_url, headers=headers).text
        article_soup = BeautifulSoup(article_page, 'lxml')

        # Assuming the image is under 'post-thumbnail.header', but you might need to adjust based on the actual page structure
        image_element = article_soup.select_one('div.post-thumbnail.header img')
        
        # if image_element:
        #     image_url = image_element['src']
        # else:
        #     # This is a placeholder in case there's no image found
        #     image_url = "default_image_url"

        news_items.append({
            "title": title_text,
            "source": "Leander ISD News",
            "url": link_url,
            "imageUrl": 'https://news.leanderisd.org/wp-content/uploads/2023/02/2023–24-Academic-Calendar-Approved.png'
        })

    return jsonify({"news": news_items})

    
# @app.route('/news', methods=['GET'])
# def news():
#     chrome_options = Options()
#     chrome_options.add_argument("--headless")
#     driver = webdriver.Chrome(executable_path='/Users/sujithalluru/Downloads/chromedriver-mac-arm64/chromedriver', options=chrome_options)
#     driver.get("https://news.leanderisd.org")
#     titles_elements = driver.find_elements("xpath", "//div[@class='item-data']")
#     links_elements = driver.find_elements("xpath", "//a[@class='wpp-post-title']")

#     links_and_titles = [(link.get_attribute('href'), title.text) for link, title in zip(links_elements, titles_elements)]

#     news_items = []
#     for link_url, title_text in links_and_titles:
#         # Navigate to the link to find the image
#         driver.get(link_url)

#         # Wait for the div containing the image to be present
#         WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, 'post-thumbnail.header')))
#         div_element = driver.find_element_by_class_name('post-thumbnail.header')
#         image_element = div_element.find_element_by_tag_name('img')
#         image_url = image_element.get_attribute('src')

#         news_items.append({
#             "title": title_text,
#             "source": "Leander ISD News",
#             "url": link_url,
#             "imageUrl": image_url
#         })

#     driver.quit()
#     return jsonify({"news": news_items})




app.run(host="0.0.0.0", port=8082, ssl_context=('cert.pem', 'key.pem'))

