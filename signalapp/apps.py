from django.apps import AppConfig

class SignalappConfig(AppConfig):
    name = 'signalapp'
    verbose_name = "Signalapp"

    def ready(self):
        import signalapp.signals