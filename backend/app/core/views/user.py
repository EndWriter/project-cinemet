from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from ..models import User, Role
from ..serializers import UserSerializer, UserCreateSerializer


# Inscription
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        user_role, created = Role.objects.get_or_create(role='user')
        user = serializer.save()
        user.role = user_role
        user.save()


# Connexion
@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if email and password:
        user = authenticate(username=email, password=password)
        if user:
            login(request, user)
            return Response({
                'message': 'Connexion réussie',
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Identifiants invalides'}, 
                       status=status.HTTP_401_UNAUTHORIZED)
    
    return Response({'error': 'Email et password requis'}, 
                   status=status.HTTP_400_BAD_REQUEST)


# Déconnexion
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message': 'Déconnexion réussie'})


# Profil utilisateur
@csrf_exempt # Ajout de notre Token lors de la requête
@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    if request.method == 'GET':
        return Response(UserSerializer(request.user).data)
    
    elif request.method in ['PUT', 'PATCH']:
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profil mis à jour avec succès',
                'user': serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Changement de mot de passe
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    
    if not current_password or not new_password:
        return Response({'error': 'Mot de passe actuel et nouveau requis'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    if not request.user.check_password(current_password):
        return Response({'error': 'Mot de passe actuel incorrect'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    request.user.set_password(new_password)
    request.user.save()
    
    return Response({'message': 'Mot de passe changé avec succès'})


# Liste des utilisateurs (admin seulement)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users_list_view(request):
    if request.user.role and request.user.role.role == 'admin':
        users = User.objects.all()
        return Response(UserSerializer(users, many=True).data)
    return Response({'error': 'Permission refusée'}, 
                   status=status.HTTP_403_FORBIDDEN)


# Obtenir le token CSRF
@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token_view(request):
    token = get_token(request)
    return Response({'csrfToken': token})
