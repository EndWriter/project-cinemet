from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_contact_email(request):
    #Envoie un email de contact à l'administrateur via Mailpit
    subject = request.data.get('subject')
    message = request.data.get('message')
    user_email = request.user.email
    user_name = f"{request.user.first_name} {request.user.last_name}"
    
    # validation des données
    if not subject or not message:
        return Response({
            'error': 'Le sujet et le message sont requis'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # message complet
    full_message = f"""
Message de contact depuis Cinemet

De: {user_name} ({user_email})
Sujet: {subject}

Message:
{message}

---
Envoyé depuis l'application Cinemet
    """
    
    try:
        # Envoi email
        send_mail(
            subject=f"[Cinemet Contact] {subject}",
            message=full_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=False,
        )
        
        return Response({
            'message': 'Email envoyé avec succès à l\'administrateur'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Erreur lors de l\'envoi de l\'email: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_contact_info(request):

    #Retourne les informations de contact pré-remplies pour l'utilisateur (user)
    return Response({
        'user_name': f"{request.user.first_name} {request.user.last_name}",
        'user_email': request.user.email,
        'admin_info': 'Ce message sera envoyé à l\'équipe d\'administration de Cinemet'
    })
