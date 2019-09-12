"""signalapp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import patterns, include, url
from django.contrib import admin
from rest_framework.urlpatterns import format_suffix_patterns
from signalapp import views

urlpatterns = patterns('',
  url(r'^$', views.index_view, name="index_view"),
  url(r'^library/$', views.index_view, name="index_view"),
  url(r'^library/.*$', views.index_view, name="index_view"),
  url(r'^pathfinder$', views.index_view, name="index_view"),
  url(r'^about$', views.index_view, name="index_view"),
  url(r'^faq/$', views.index_view, name="index_view"),
  url(r'^admin/', include(admin.site.urls)),
  url(r'^accounts/', include(admin.site.urls)),
  url(r'^tinymce/', include('tinymce.urls')),
  url('', include('django.contrib.auth.urls', namespace='auth')),
  url(r'^api/', include('rest_framework.urls', namespace='rest_framework')),
  url(r'^api/themes/$', views.ThemeList.as_view()),
  url(r'^api/themes/(?P<pk>[0-9]+)/$', views.ThemeDetail.as_view()),
  url(r'^api/libthemes/$', views.LibraryThemeList.as_view()),
  url(r'^api/questions/$', views.QuestionList.as_view()),
  url(r'^api/questions/(?P<pk>[0-9]+)/$', views.QuestionDetail.as_view()),
  url(r'^api/libqueries/$', views.LibraryQuestionList.as_view()),
  url(r'^api/choices/$', views.ChoiceList.as_view()),
  url(r'^api/topics/$', views.TopicList.as_view()),
  url(r'^api/blocks/$', views.BlockList.as_view()),
  url(r'^api/resources/$', views.ResourceList.as_view()),
  url(r'^api/blocks/(?P<url>[a-z]+)/$', views.ContentList.as_view()),
  url(r'^api/assessments/$', views.AssessmentList.as_view()),
  url(r'^api/assessments/(?P<code>[\w]+)/$', views.AssessmentDetail.as_view()),
  url(r'^api/finderobj/(?P<code>[\w]+)/$', views.FinderDetail.as_view()),
  url(r'^api/gen-img/(?P<code>[\w]+)/$', views.GenImg.as_view()),
  url(r'^assessments/chart/$', views.AssessmentChart, name="assessment_chart"),
  url(r'^assessments/svg/$', views.AssessmentSVG, name="assessment_svg"),
  url(r'^assessments/results/(?P<p>[0-9]+)/$', views.AssessmentResults, name="assessment_results"),
  url(r'^assessments/csv/$', views.AssessmentCSV, name="assessment_csv"),
  url(r'^api/mail/$', views.mail),
  url(r'^api/results-mailer/$', views.mailer),
  url(r'^api/export/$', views.export),
  url(r'^api/supporters/$', views.SupporterList.as_view()),
  url(r'^api/faqs/$', views.FaqList.as_view()),
  url(r'^api/search/faqs/$', views.FaqSearch),
)

urlpatterns = format_suffix_patterns(urlpatterns)