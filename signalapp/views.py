from django.shortcuts import render, redirect, render_to_response
from django.contrib.auth import logout as auth_logout
from django.http import Http404, HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.renderers import JSONRenderer
from signalapp.serializers import ChoiceSerializer, QuestionSerializer, BlockSerializer, TopicSerializer, ThemeSerializer, AssessmentSerializer, ResourceSerializer, SupportSerializer, FaqSerializer
from signalapp.questions.models import Choice, Question, Topic, Theme
from signalapp.contentblocks.models import ContentBlock
from signalapp.finderobjects.models import FinderObject
from signalapp.resources.models import Resource
from signalapp.supporters.models import Supporter
from signalapp.faqs.models import Faq
from django.contrib.auth.models import User
import os
from os import path
import json
import demjson
import csv
import time
import datetime
# from configparser import RawConfigParser
import logging
logger = logging.getLogger(__name__)
from django.core.mail import send_mail, EmailMessage, EmailMultiAlternatives
from django.views.static import serve
from itertools import chain
from django.contrib.auth.decorators import user_passes_test

def index_view(request):
  # logger.debug("")
  return render(request, 'index.html')

def AssessmentChart(request):
  assessment = FinderObject.objects.get(code=request.GET.get('code', None))
  return render(request, 'assessment_graph.html', {"assessment": assessment})

def AssessmentSVG(request):
  assessment = FinderObject.objects.get(code=request.GET.get('code', None))
  questions = Question.objects.all()
  serializer = QuestionSerializer(questions, many=True)
  return render(request, 'assessment.html', {"assessment": assessment, "questions": JSONRenderer().render(serializer.data)})

class GenImg(APIView):
  def get(self, request, code, format=None):
    imgurl = "http://startupgps.org/assessments/chart?code="+str(code)
    imgCmd = "wkhtmltoimg.sh %s %s"%(imgurl, os.path.abspath(os.path.dirname(__name__))+"/static/uploads/assessments/"+str(code)+"/"+".jpg")
    os.system(imgCmd)
    return Response(imgurl)

class FinderDetail(APIView):
  def get_object(self, code, req):
    try:
      return FinderObject.objects.get(code=code)
    except FinderObject.DoesNotExist:
      raise Http404
  def get(self, request, code, format=None):
    assessment = self.get_object(code, request)
    # serializer = AssessmentSerializer(assessment)
    return Response(demjson.decode(assessment.data.replace(" None", " ''").replace(":None", ":''").replace("True", "true").replace("False", "false")))

@user_passes_test(lambda u: u.is_superuser)
def AssessmentResults(request, p=1, format=None):
  NoneType = type(None)
  assessments = FinderObject.objects.all()[((p-1)*100):(p*100)]
  assData = []
  for assessment in assessments:
    if type(assessment.code) is not NoneType:
      # assData.append(AssessmentSerializer(assessment).data)
      assData.append(demjson.decode(assessment.answers))
  serializer = AssessmentSerializer(assessments, many=True)
  questions = Question.objects.all()
  qserializer = QuestionSerializer(questions, many=True)
  return render(request, 'assessment_results.html', {"assData": assData, "assessments": JSONRenderer().render(serializer.data), "questions": JSONRenderer().render(qserializer.data)})
@user_passes_test(lambda u: u.is_superuser)
def AssessmentCSV(request):
  NoneType = type(None)
  ts = time.time()
  st = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d')
  response = HttpResponse(content_type='text/csv')
  response['Content-Disposition'] = 'attachment; filename="assessments_'+st+'.csv"'
  assessments = FinderObject.objects.all()
  row0 = demjson.decode(assessments[0].answers)
  row1 = []
  for i in row0:
    row1.append(i['question'])
  row1.append('Timestamp')
  writer = csv.writer(response)
  writer.writerow(row1)
  for ass in assessments:
    if type(ass.code) is not NoneType:
      row = demjson.decode(ass.answers)
      tmp = []
      for r in row:
        tmp.append(r['answer'])
      tmp.append(ass.created)
      writer.writerow(tmp)
  return response

class BlockList(APIView):
  def get(self, request, format=None):
    blocks = ContentBlock.objects.all()
    serializer = BlockSerializer(blocks, many=True)
    return Response(serializer.data)

class SupporterList(APIView):
  def get(self, request, format=None):
    supporters = Supporter.objects.all()
    serializer = SupportSerializer(supporters, many=True)
    return Response(serializer.data)

class FaqList(APIView):
  def get(self, request, format=None):
    faqs = Faq.objects.all()
    serializer = FaqSerializer(faqs, many=True)
    return Response(serializer.data)

class ResourceList(APIView):
  def get(self, request, format=None):
    resources = Resource.objects.all()
    serializer = ResourceSerializer(resources, many=True)
    return Response(serializer.data)

class ContentList(APIView):
  def get(self, request, url):
    blocks = ContentBlock.objects.all().filter(url=url)
    serializer = BlockSerializer(blocks, many=True)
    return Response(serializer.data)

class QuestionList(APIView):
  def get(self, request, format=None):
    questions = Question.objects.all()
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)
class LibraryQuestionList(APIView):
  def get(self, request, format=None):
    questions = Question.objects.all().filter(use_in_library=True)
    # funding_query = Question.objects.get(pk=31)
    # question_list = list(chain(questions, funding_query))
    # questions._result_cache.append(funding_query)
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)

class QuestionDetail(APIView):
  def get_object(self, pk, req):
    try:
      return Question.objects.get(pk=pk)
    except Question.DoesNotExist:
      raise Http404
  def get(self, request, pk, format=None):
    question = self.get_object(pk, request)
    serializer = QuestionSerializer(question)
    return Response(serializer.data)

class ChoiceList(APIView):
  def get(self, request, format=None):
    choices = Choice.objects.all()
    serializer = ChoiceSerializer(choices, many=True)
    return Response(serializer.data)

class TopicList(APIView):
  def get(self, request, format=None):
    topics = Topic.objects.all().filter(secondary_taxonomy=False)
    serializer = TopicSerializer(topics, many=True)
    return Response(serializer.data)

class ThemeList(APIView):
  def get(self, request, format=None):
    themes = Theme.objects.all().filter(secondary_taxonomy=False)
    serializer = ThemeSerializer(themes, many=True)
    return Response(serializer.data)
class LibraryThemeList(APIView):
  def get(self, request, format=None):
    themes = Theme.objects.all().filter()
    serializer = ThemeSerializer(themes, many=True)
    return Response(serializer.data)

class ThemeDetail(APIView):
  def get_object(self, pk, req):
    try:
      return Theme.objects.get(pk=pk)
    except Theme.DoesNotExist:
      raise Http404
  def get(self, request, pk, format=None):
    theme = self.get_object(pk, request)
    serializer = ThemeSerializer(theme)
    return Response(serializer.data)

class AssessmentList(APIView):
  def get(self, request, format=None):
    assessments = FinderObject.objects.all()
    serializer = AssessmentSerializer(assessments, many=True)
    return Response(serializer.data)
  def post(self, request, format=None):
    serializer = AssessmentSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AssessmentDetail(APIView):
  def get_object(self, code, req):
    try:
      return FinderObject.objects.filter(code__iexact=code).first()
    except FinderObject.DoesNotExist:
      raise Http404
  def get(self, request, code, format=None):
    assessment = self.get_object(code, request)
    serializer = AssessmentSerializer(assessment)
    return Response(serializer.data)
  def put(self, request, code, format=None):
    assessment = self.get_object(code, request)
    serializer = AssessmentSerializer(assessment, data=request.data)
    if serializer.is_valid():
      serializer.save(code=code)
      return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  def delete(self, request, code, format=None):
    assessment = self.get_object(code, request)
    assessment.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

def mail(request, format=None):
  mailopts = json.loads(request.body.decode('utf-8'))
  recipients = []
  recipients.append(mailopts['mailTo'])
  if(mailopts['necec']):
    recipients.append("hello@startupgps.org")
  sender_email = mailopts['mailFrom']
  sender_name = mailopts['sender_name']
  sender_company = mailopts['sender_company']
  sender_msg = mailopts['message']
  subject = "%s shared StartupGPS Pathfinder results with you!"%(sender_name)
  body = "Hi there,\r\n\r\n%s recently used StartupGPS Pathfinder Survey (http://startupgps.org) to track the progress of their startup %s. She or he has decided to share results with you - attached to this email as a PDF.\r\n\r\n"%(sender_name, sender_company)
  if(sender_msg): 
    body += "Here's what %s has to say:\r\n\r\n%s\r\n\r\n"%(sender_name, sender_msg)
  body += "Have a wonderful day!\r\n\r\nThe StartupGPS team\r\n\r\n\r\n"
  body_html = "<div><p>Hi there,<br><br><br>%s recently used StartupGPS <a href='https://startupgps.org/#/pathfinder'>Pathfinder Survey</a> to track the progress of their startup %s. She or he has decided to share results with you - attached to this email as a PDF.</p>"%(sender_name, sender_company)
  if(sender_msg): 
    body_html += "<p>Here's what %s has to say:</p>\r\n\r\n%s\r\n\r\n"%(sender_name, sender_msg)
  body_html += "<p>Have a wonderful day!</p><p>The StartupGPS team</p><br><img width='200' src='https://startupgps.org/static/assets/img/StartupGPS_logo.jpg'/><br><br><br></div>"
  from_email = "hello@startupgps.org"
  code = mailopts['code']
  pdf = os.path.abspath(os.path.dirname(__name__))+"/static/uploads/assessments/"+code+"/"+code+".pdf"
  msg = EmailMultiAlternatives(subject, body, from_email, recipients)
  msg.attach_alternative(body_html, "text/html")
  msg.attach_file(pdf)
  assessments = mailopts['assessments']
  if(assessments):
    for assessment in assessments:
      assessment_path = os.path.abspath(os.path.dirname(__name__))+"/static/uploads/assessments/"+assessment+"/"+assessment+".pdf"
      msg.attach_file(assessment_path)
  if(msg.send()):
    return HttpResponse("success")
  else:
    return HttpResponse("failure")

def mailer(request, format=None):
  mailopts = json.loads(request.body.decode('utf-8'))
  name = mailopts['name']
  code = mailopts['code']
  subject, from_email, to = "Thanks for using StartupGPS Pathfinder. Here are your results...", "StartupGPS <hello@startupgps.org>", mailopts['email']
  text_content = "Hi %s,\r\n\r\nIt's Ned from StartupGPS (https://startupgps.org).  Thanks for being one of Pathfinder's first 500 users. Would you mind taking a super easy survey (https://necec.typeform.com/to/xctnQD) about the experience while it's fresh in your mind? I'd really appreciate the feedback.\r\n\r\n\r\nHere is your unique access code to see these results on our site:\r\n%s\r\n\r\n\r\nDefinitely keep this email in your archive. \r\n\r\nThe code will allow you to reload your answers on the app anytime, anywhere. \r\n\r\nPlease shoot me an email directly (ned@startupgps.org) if you have any questions. Or if you just want to say hi! :)\r\n\r\n\r\nAll the best,\r\nNed"%(name, code)
  html_content = "<div style='color:#413f33;'><p>Hi %s,</p><p>It's Ned from <a href='https://startupgps.org'>StartupGPS</a>. Thanks for being one of Pathfinder's first 500 users. Would you mind taking a <a href='https://necec.typeform.com/to/xctnQD'>super easy survey</a> about the experience while it's fresh in your mind? I'd really appreciate the feedback.</p><br><p><strong>Here is your unique access code to see these results on our site:</strong></p><center><strong style='display:block;text-align:center;color:#ef4527;font-size:26px;padding:10px 0;'>%s</strong></center><p>Definitely keep this email in your archive. </p><p>The code will allow you to <a href='https://startupgps.org/#/finder'>reload your answers on the app</a> anytime, anywhere.</p><p><a href='mailto:ned@startupgps.org'>Please shoot me an email directly</a> if you have any questions. Or if you just want to say hi! :)</p><br><p>All the best,<br>Ned</p><br><img width='200' src='https://startupgps.org/static/assets/img/StartupGPS_logo.jpg'/><br><br><br></div>"%(name, code)
  pdf = os.path.abspath(os.path.dirname(__name__))+"/static/uploads/assessments/"+code+"/"+code+".pdf"
  msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
  msg.attach_alternative(html_content, "text/html")
  msg.attach_file(pdf)
  if(msg.send()):
    return HttpResponse("success")
  else:
    return HttpResponse("failure")

def export(request, format=None):
  filename = request.body.decode('utf-8')
  filepath = os.path.abspath(os.path.dirname(__name__))+"/static/uploads/assessments/"+filename+"/"+filename+".pdf"
  response = HttpResponse(filepath, content_type='application/pdf')
  response['Content-Disposition'] = 'attachment; filename='+filename+'".xls"'
  # return serve(request, os.path.basename(filepath), os.path.dirname(filepath))
  return response

def FaqSearch(request, format=None):
  terms = request.body.decode('utf-8')
  faqs = Faq.objects.filter(question__icontains=terms) | Faq.objects.filter(answer__icontains=terms)
  serializer = FaqSerializer(faqs, many=True)
  return JsonResponse(serializer.data, safe=False)