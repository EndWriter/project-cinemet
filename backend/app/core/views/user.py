from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
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
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    return Response(UserSerializer(request.user).data)


# Liste des utilisateurs (admin seulement)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users_list_view(request):
    if request.user.role and request.user.role.role == 'admin':
        users = User.objects.all()
        return Response(UserSerializer(users, many=True).data)
    return Response({'error': 'Permission refusée'}, 
                   status=status.HTTP_403_FORBIDDEN)
