"""
User service for business logic and database operations
"""
from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.security import get_password_hash, verify_password
from app.models.user import User


class UserService:
    """Service class for User operations"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_id(self, user_id: str | UUID) -> Optional[User]:
        """
        Get user by ID
        
        Args:
            user_id: User UUID
            
        Returns:
            User instance or None
        """
        result = await self.db.execute(
            select(User)
            .options(selectinload(User.roles))
            .where(User.id == user_id, User.deleted_at.is_(None))
        )
        return result.scalar_one_or_none()
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """
        Get user by email
        
        Args:
            email: User email address
            
        Returns:
            User instance or None
        """
        result = await self.db.execute(
            select(User)
            .options(selectinload(User.roles))
            .where(User.email == email, User.deleted_at.is_(None))
        )
        return result.scalar_one_or_none()
    
    async def get_by_username(self, username: str) -> Optional[User]:
        """
        Get user by username
        
        Args:
            username: Username
            
        Returns:
            User instance or None
        """
        result = await self.db.execute(
            select(User)
            .options(selectinload(User.roles))
            .where(User.username == username, User.deleted_at.is_(None))
        )
        return result.scalar_one_or_none()
    
    async def authenticate(self, email: str, password: str) -> Optional[User]:
        """
        Authenticate user by email and password
        
        Args:
            email: User email
            password: Plain text password
            
        Returns:
            User instance if authenticated, None otherwise
        """
        user = await self.get_by_email(email)
        
        if not user:
            return None
        
        if not verify_password(password, user.password_hash):
            return None
        
        if not user.is_active:
            return None
        
        return user
    
    async def create(
        self,
        email: str,
        username: str,
        password: str,
        first_name: str,
        last_name: str,
        **kwargs
    ) -> User:
        """
        Create new user
        
        Args:
            email: User email
            username: Username
            password: Plain text password
            first_name: First name
            last_name: Last name
            **kwargs: Additional user fields
            
        Returns:
            Created user instance
        """
        password_hash = get_password_hash(password)
        
        user = User(
            email=email,
            username=username,
            password_hash=password_hash,
            first_name=first_name,
            last_name=last_name,
            **kwargs
        )
        
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        
        return user
    
    async def update(self, user: User, **kwargs) -> User:
        """
        Update user fields
        
        Args:
            user: User instance to update
            **kwargs: Fields to update
            
        Returns:
            Updated user instance
        """
        for key, value in kwargs.items():
            if hasattr(user, key):
                setattr(user, key, value)
        
        await self.db.commit()
        await self.db.refresh(user)
        
        return user
    
    async def change_password(self, user: User, new_password: str) -> User:
        """
        Change user password
        
        Args:
            user: User instance
            new_password: New plain text password
            
        Returns:
            Updated user instance
        """
        from datetime import datetime
        
        user.password_hash = get_password_hash(new_password)
        user.password_changed_at = datetime.utcnow()
        
        await self.db.commit()
        await self.db.refresh(user)
        
        return user
    
    async def soft_delete(self, user: User) -> User:
        """
        Soft delete user
        
        Args:
            user: User instance to delete
            
        Returns:
            Deleted user instance
        """
        user.soft_delete()
        user.is_active = False
        
        await self.db.commit()
        await self.db.refresh(user)
        
        return user
