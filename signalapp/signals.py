from django.db.models.signals import pre_save, post_save, pre_delete, post_delete
from django.dispatch import receiver
from signalapp.finderobjects.models import FinderObject
# from django.contrib.auth.models import User
import logging
logger = logging.getLogger(__name__)
import os
from os import path

@receiver(post_save, sender=FinderObject)
def gen_pdf(sender, **kwargs):
  assessment = kwargs.get('instance')
  if(assessment.data):
    url = "http://startupgps.org/assessments/svg?code="+str(assessment.code)
    imgurl = "http://startupgps.org/assessments/chart?code="+str(assessment.code)
    mkdirCmd = "mkdir -p %s"%(os.path.abspath(os.path.dirname(__name__))+"/static/uploads/assessments/"+str(assessment.code))
    os.system(mkdirCmd)
    assessment_path = os.path.abspath(os.path.dirname(__name__))+"/static/uploads/assessments/"+str(assessment.code)+"/"
    pdfCmd = "wkhtmltopdf.sh %s %s"%(url, assessment_path+str(assessment.code)+".pdf")
    os.system(pdfCmd)
    imgCmd = "wkhtmltoimg.sh %s %s"%(imgurl, assessment_path+str(assessment.code)+".jpg")
    os.system(imgCmd)

@receiver(pre_delete, sender=FinderObject)
def delete_assessment_files(sender, **kwargs):
  assessment = kwargs.get('instance')
  assessment_dir = os.path.abspath(os.path.dirname(__name__))+"/static/uploads/assessments/"+str(assessment.code)
  rmCmd = "rm -rf %s"%(assessment_dir)
  os.system(rmCmd)