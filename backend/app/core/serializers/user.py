from rest_framework import serializers
from ..models import User, Role


# Serializers pour role 
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'role', 'created_at']

# serializers pour users
class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id_user', 'username', 'email', 'first_name', 'last_name', 'role', 'created_at', 'updated_at']
        # je securise le mot de passe 
        extra_kwargs = {
            'password': {'write_only': True}
        }

# Serializers pour creer un compte
class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password']
    
    def create(self, validated_data):
        # on retire le mdp pour ne pas le sauvegarder de maniere lisible
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user