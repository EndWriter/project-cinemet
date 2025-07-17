from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.paginator import Paginator
from django.db.models import Q
from ..models import User, Role
from ..serializers import UserSerializer, UserCreateSerializer


def check_admin_permission(user):
    # Check de si admin ou non
    return user.role and user.role.role == 'admin'


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def admin_users_view(request):
    #vue pour liste et crud user 
    
    if not check_admin_permission(request.user):
        return Response({'error': 'Permission refusée'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        # Pagination
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 10))
        search = request.GET.get('search', '')
        queryset = User.objects.all().order_by('-created_at')
    
        # Filtrage par recherche
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )
        # Pagination
        paginator = Paginator(queryset, limit)
        users_page = paginator.get_page(page)
        
        return Response({
            'users': UserSerializer(users_page.object_list, many=True).data,
            'total': paginator.count,
            'page': page,
            'total_pages': paginator.num_pages,
            'has_next': users_page.has_next(),
            'has_previous': users_page.has_previous()
        })
    
    elif request.method == 'POST':
        # Créer un nouvel utilisateur
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            role_name = request.data.get('role', 'user') # Role user à la création d'un nouvel utilisateur
            user_role, created = Role.objects.get_or_create(role=role_name)
            
            user = serializer.save()
            user.role = user_role
            user.save()
            
            return Response({
                'message': 'Utilisateur créé avec succès',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def admin_user_detail_view(request, user_id):
    
    if not check_admin_permission(request.user):
        return Response({'error': 'Permission refusée'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = User.objects.get(id_user=user_id)
    except User.DoesNotExist:
        return Response({'error': 'Utilisateur non trouvé'}, 
                       status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        return Response(UserSerializer(user).data)
    
    elif request.method == 'PUT':
        # Mise à jour complète
        serializer = UserSerializer(user, data=request.data, partial=False)
        if serializer.is_valid():
            # Gérer le changement de rôle
            role_name = request.data.get('role')
            if role_name:
                user_role, created = Role.objects.get_or_create(role=role_name)
                user.role = user_role
            
            user = serializer.save()
            return Response({
                'message': 'Utilisateur mis à jour avec succès',
                'user': UserSerializer(user).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Empêcher la suppression de son propre compte
        if user.id_user == request.user.id_user:
            return Response({'error': 'Vous ne pouvez pas supprimer votre propre compte'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        user.delete()
        return Response({'message': 'Utilisateur supprimé avec succès'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_roles_view(request):
    #Vue Role
    if not check_admin_permission(request.user):
        return Response({'error': 'Permission refusée'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    from ..serializers import RoleSerializer
    roles = Role.objects.all()
    return Response(RoleSerializer(roles, many=True).data)