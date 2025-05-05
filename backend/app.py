from flask import Flask, request, render_template, redirect, url_for, Response, jsonify, send_file
from werkzeug.utils import secure_filename
import os
import cv2
import numpy as np
from keras.models import load_model
from collections import deque
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import ssl
import base64
import logging
import datetime
import requests
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from io import BytesIO
import statsmodels.api as sm
from flask_cors import CORS
import folium
import geopandas as gpd

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static'
CORS(app)

# Load the dataset (make sure to place your dataset file in the appropriate directory)
crime = pd.read_csv('crime-dataset.csv')

@app.route('/api/states', methods=['GET'])
def get_states():
    states = crime['STATE/UT'].str.upper().unique()
    return jsonify(sorted(states.tolist()))

# services... 

@app.route('/api/query_analysis', methods=['GET'])
def query_analysis():
    year = int(request.args.get('year'))
    state = request.args.get('state')

    # Ensure case consistency by converting both user input and dataset to uppercase
    state = state.upper()
    crime['STATE/UT'] = crime['STATE/UT'].str.upper()

    # Filter dataset by year and state
    crime_filtered = crime[(crime['YEAR'] == year) & (crime['STATE/UT'] == state)]

    # Select the top 4 crimes (excluding total columns)
    crime_columns = ['MURDER', 'ATTEMPT TO MURDER', 'CULPABLE HOMICIDE NOT AMOUNTING TO MURDER',
                     'RAPE', 'KIDNAPPING & ABDUCTION', 'THEFT', 'ROBBERY', 'DOWRY DEATHS',
                     'CRUELTY BY HUSBAND OR HIS RELATIVES', 'ASSAULT ON WOMEN WITH INTENT TO OUTRAGE HER MODESTY']
    crime_sum = crime_filtered[crime_columns].sum().sort_values(ascending=False)

    # Calculate percentages for the top 4 crimes
    total_crimes = crime_filtered['TOTAL IPC CRIMES'].sum()
    if total_crimes > 0:
        top_crimes = crime_sum.head(4)
        top_crimes_percentage = (top_crimes / total_crimes) * 100
    else:
        top_crimes = crime_sum.head(4)
        top_crimes_percentage = [0] * len(top_crimes)  # Default to 0% if no crimes exist

    # Create a report
    report = pd.DataFrame({
        'Crime': top_crimes.index,
        'Number of Cases': top_crimes.values,
        'Percentage': [round(p, 2) for p in top_crimes_percentage]  # Ensure proper formatting
    })

    # Convert to dictionary for JSON response
    result = report.to_dict(orient='records')
    return jsonify(result)

@app.route('/api/graph_analysis', methods=['GET'])
def graph_analysis():
    """
    Endpoint for Graph Analysis:
    - Input: year (int), crime_type (str)
    - Output: Bar chart showing the crime data for the selected type across states
    """
    # Get year and crime_type from query parameters
    year = int(request.args.get('year'))
    crime_type = request.args.get('crime_type')

    # Filter data for the given year
    crime_filtered = crime[crime['YEAR'] == year]

    # Create the plot
    plt.figure(figsize=(10, 6))
    sns.barplot(x='STATE/UT', y=crime_type, data=crime_filtered, palette="viridis")
    plt.title(f"{crime_type} in different States for the year {year}")
    plt.xticks(rotation=90)
    plt.ylabel('Number of Cases')
    plt.xlabel('State')
    plt.tight_layout()

    # Save the plot to a BytesIO object
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plt.close()

    # Send the plot as a file response
    return send_file(buffer, mimetype='image/png', as_attachment=False, download_name=f'{crime_type}_{year}.png')

@app.route('/api/predictive_analysis', methods=['GET'])
def predictive_analysis():
    """
    Endpoint for Predictive Analysis:
    - Input: state (str), year (int)
    - Output: Forecasted crime trends for the next 5 years
    """
    state = request.args.get('state')
    year = int(request.args.get('year'))

    crime_state = crime[crime['STATE/UT'] == state]

    if crime_state.empty:
        return jsonify({'error': f'No data found for state: {state}'}), 404

    crime_state_yearly = crime_state.groupby('YEAR').sum()['TOTAL IPC CRIMES']

    if len(crime_state_yearly) < 2:
        return jsonify({'error': 'Not enough data points for prediction'}), 400

    model = sm.tsa.ARIMA(crime_state_yearly, order=(1, 0, 1))
    model_fit = model.fit()

    forecast = model_fit.forecast(steps=5)
    future_years = [year + i for i in range(1, 6)]

    result = {'years': future_years, 'forecast': forecast.tolist()}
    return jsonify(result)

# Takes year and crime type - returns map
@app.route('/api/crime-map')
def plot_crime_map():

    india_geo = gpd.read_file('india_map/map.shp')

    # Normalize state names
    crime['STATE/UT'] = crime['STATE/UT'].str.upper().str.replace('&', 'AND').str.replace(' ', '_')
    india_geo['NAME_1'] = india_geo['NAME_1'].str.upper().str.replace(' ', '_')

    # Ensure CRS is set
    if india_geo.crs is None:
        india_geo.set_crs(epsg=4326, inplace=True)

    # Get parameters from query string
    year = int(request.args.get('year', 2013))  # Default year 2013
    crime_type = request.args.get('crime_type', 'TOTAL IPC CRIMES')  # Default to 'TOTAL IPC CRIMES'

    # Filter and aggregate crime data
    crime_by_state = crime[crime['YEAR'] == year].groupby('STATE/UT')[crime_type].sum().reset_index()

    # Merge crime data with GeoDataFrame
    india_map = india_geo.merge(crime_by_state, left_on='NAME_1', right_on='STATE/UT')

    # Create Folium map
    m = folium.Map(location=[20.5937, 78.9629], zoom_start=5)
    folium.Choropleth(
        geo_data=india_map,
        data=crime_by_state,
        columns=['STATE/UT', crime_type],
        key_on='feature.properties.NAME_1',
        fill_color='YlOrRd',
        fill_opacity=0.7,
        line_opacity=0.2,
        legend_name=f"{crime_type} in {year}"
    ).add_to(m)

    # Return map as HTML
    return m._repr_html_()

# Takes state and crime type - returns Crime Trends (Line Chart)
@app.route('/api/crime-trends', methods=['GET'])
def crime_trends():
    # Normalize state names
    crime['STATE/UT'] = crime['STATE/UT'].str.lower()
    state = request.args.get('state', '').lower()  # State as query parameter
    crime_type = request.args.get('crime_type', 'MURDER')  # Default to 'MURDER'

    # Filter data
    state_data = crime[crime['STATE/UT'] == state]
    if state_data.empty:
        return {"error": f"No data available for state: {state}"}, 404
    
    # Aggregate yearly totals
    trends = state_data.groupby('YEAR')[crime_type].sum()

    # Create the plot
    plt.figure(figsize=(10, 6))
    sns.lineplot(data=trends, marker='o')
    plt.title(f"{crime_type} Trends in {state.capitalize()}")
    plt.xlabel("Year")
    plt.ylabel("Number of Cases")
    plt.grid()

    # Save the plot to a BytesIO buffer
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plt.close()

    # Return the plot as a file response
    return send_file(buffer, mimetype='image/png')

# Takes state and year - returns Crime stats (Pie Chart)
@app.route('/api/crime-stats', methods=['GET'])
def crime_stats():
    crime['STATE/UT'] = crime['STATE/UT'].str.lower()
    state = request.args.get('state', '').lower()  # State as query parameter
    year = int(request.args.get('year', 2013))  # Default year 2013

    # Filter data
    state_data = crime[(crime['STATE/UT'] == state) & (crime['YEAR'] == year)]
    if state_data.empty:
        return {"error": f"No data available for state: {state} in year: {year}"}, 404

    # Select relevant columns
    crime_categories = state_data[['MURDER', 'RAPE', 'THEFT', 'DOWRY DEATHS', 'ARSON']].sum()

    # Create the pie chart
    plt.figure(figsize=(8, 6))
    crime_categories.plot.pie(
        autopct='%1.1f%%', startangle=140, colors=sns.color_palette("pastel")
    )
    plt.title(f"Crime stats in {state.capitalize()}, {year}")
    plt.ylabel("")  # Remove y-label for better display

    # Save the plot to a BytesIO buffer
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plt.close()

    # Return the plot as a file response
    return send_file(buffer, mimetype='image/png')

# Plot heatmap (row: states , columns: crime_types , cell: normalised_total_no_of_crime)
@app.route('/api/crime-severity-heatmap', methods=['GET'])
def crime_severity_heatmap():
    # List of recommended columns for severity analysis
    severity_columns = [
        'MURDER', 'RAPE', 'DOWRY DEATHS', 'ARSON', 
        'ASSAULT ON WOMEN WITH INTENT TO OUTRAGE HER MODESTY',
        'CRUELTY BY HUSBAND OR HIS RELATIVES', 'BURGLARY', 
        'THEFT', 'ROBBERY', 'RIOTS', 'DACOITY'
    ]
    
    # Normalize state names
    crime['STATE/UT'] = crime['STATE/UT'].str.upper()
    
    # Aggregate the data by state and sum up severity columns
    severity_data = crime.groupby('STATE/UT')[severity_columns].sum()

    # Normalize data for heatmap (optional for better visualization)
    normalized_data = severity_data.div(severity_data.sum(axis=1), axis=0)
    
    # Create the heatmap using Seaborn
    plt.figure(figsize=(12, 8))
    sns.heatmap(normalized_data, annot=True, cmap='Reds', fmt='.2f', linewidths=0.5)
    plt.title("Crime Severity Heatmap by State", fontsize=16)
    plt.xlabel("Crime Types", fontsize=12)
    plt.ylabel("State/UT", fontsize=12)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    
    # Save the plot to a BytesIO buffer
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plt.close()

    # Return the heatmap as a file response
    return send_file(buffer, mimetype='image/png', as_attachment=False)


# Vedio apis...

should_process_video = False

@app.route('/api/start_processing', methods=['POST'])
def start_processing():
    data = request.get_json()
    filename = data['filename']
    global should_process_video
    should_process_video = True
    return jsonify({'message': 'Processing started'})

@app.route('/api/upload_vedio', methods=['GET', 'POST'])
def upload_video():
    if request.method == 'POST':
        f = request.files['file']
        filename = secure_filename(f.filename)

        # Ensure the directory exists
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        f.save(filepath)

        # Return the filename as a plain text response
        return filename

@app.route('/api/processed_video_feed/<filename>')
def processed_video_feed(filename):
    video_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    # Check if the video exists
    if os.path.exists(video_path):
        return Response(generate_frames(video_path),
                        mimetype='multipart/x-mixed-replace; boundary=frame')
    else:
        return "Video not found", 404

@app.route('/api/camera_feed')
def camera_feed():
    return Response(generate_frames(0),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

def send_email(subject, body, attachment=None):
    try:
        # Define our SMTP email server details
        smtp_server = "smtp.gmail.com"
        port = 587  # For starttls
        username =  "khushibansal635@gmail.com"
        password = "mgov uygz hcok khgh"

        # Create a secure SSL context
        context = ssl.create_default_context()

        # Try to log in to server and send email
        server = smtplib.SMTP(smtp_server, port)
        server.ehlo()  # Can be omitted
        server.starttls(context=context)  # Secure the connection
        server.ehlo()  # Can be omitted
        server.login(username, password)

        msg = MIMEMultipart()
        msg['From'] = username
        msg['To'] = 'khushi.2125csme1013@kiet.edu'
        msg['Subject'] = subject
        current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Get the location
        response = requests.get('https://ipinfo.io')
        if response.status_code == 200:
            data = response.json()
            location = f"{data.get('city', 'Unknown city')}, {data.get('region', 'Unknown region')}"
        else:
            location = 'Unknown'

        # Create the email body
        body = (f'Dear Author,\n\nViolence Deteced at {current_time}.\nThe location is: {location}. \n\n'
                f'Please take an action.The current situation given bellow: ')

        msg.attach(MIMEText(body, 'plain'))

        if attachment is not None:
            _, img_encoded = cv2.imencode('.jpg', attachment, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
            img_as_bytes = img_encoded.tobytes()

            img_part = MIMEBase('image', "jpeg")
            img_part.set_payload(img_as_bytes)
            encoders.encode_base64(img_part)

            img_part.add_header('Content-Disposition', 'attachment', filename='detected_frame.jpg')
            msg.attach(img_part)

        server.send_message(msg)
        server.quit()

        logging.info('Email sent.')
    except Exception as e:
        logging.error(f'Error sending email: {str(e)}')


def generate_frames(video_path):
    model = load_model('model/vgg16_model.h5', compile=False)

    image_height, image_width = 96, 96  # 128,128
    sequence_length = 16
    class_list = ["Violence", "NonViolence"]

    video_reader = cv2.VideoCapture(video_path)
    fps = video_reader.get(cv2.CAP_PROP_FPS)
    print(f'The video has {fps} frames per second.')

    frames_queue = deque(maxlen=sequence_length)

    predicted_class_name = ''
    predicted_confidence = 0
    alart_count = 0
    mail_sent = False

    while video_reader.isOpened():
        ok, frame = video_reader.read()
        if not ok:
            break

        resized_frame = cv2.resize(frame, (image_height, image_width))

        normalized_frame = resized_frame / 255

        frames_queue.append(normalized_frame)

        if len(frames_queue) == sequence_length:
            # input_data = np.expand_dims(frames_queue, axis=0)
            # predicted_labels_probabilities = model.predict([input_data, input_data])[0]  # provide the input twice
            predicted_labels_probabilities = model.predict(np.expand_dims(frames_queue, axis=0))[0]

            predicted_label = np.argmax(predicted_labels_probabilities)

            predicted_class_name = class_list[predicted_label]
            predicted_confidence = predicted_labels_probabilities[predicted_label]

        text = f'{predicted_class_name}: {predicted_confidence:.2f}'

        # Calculate the text size based on the video's height
        text_size = frame.shape[0] / 4  # Adjust the denominator to get the desired text size

        if predicted_class_name == "Violence":
            cv2.putText(frame, text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, text_size / 100, (0, 0, 255), 2)
            email_subject = 'Violence Detected!!!'
            email_body = '<p>We have detected violence in the video, please check.</p>'
            alart_count += 1
            if alart_count >= 10 and mail_sent == False:
                send_email(email_subject, email_body, frame)
                mail_sent = True
        else:
            cv2.putText(frame, text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, text_size / 100, (0, 255, 0), 2)

        ret, jpeg = cv2.imencode('.jpg', frame)
        frame = jpeg.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

    video_reader.release()
    cv2.destroyAllWindows()        



if __name__ == '__main__':
    app.run(debug=True)
