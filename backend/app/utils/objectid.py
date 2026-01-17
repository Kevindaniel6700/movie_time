"""
ObjectId utility module for handling MongoDB ObjectId conversions and validations.
"""
from bson import ObjectId
from bson.errors import InvalidId
from typing import Any
from pydantic import GetCoreSchemaHandler
from pydantic_core import core_schema


class PyObjectId(str):
    """
    Custom type for handling MongoDB ObjectId in Pydantic models.
    Converts ObjectId to string for JSON serialization.
    """
    
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.union_schema([
            core_schema.is_instance_schema(ObjectId),
            core_schema.chain_schema([
                core_schema.str_schema(),
                core_schema.no_info_plain_validator_function(cls.validate),
            ]),
        ], serialization=core_schema.to_string_ser_schema())
    
    @classmethod
    def validate(cls, value: Any) -> str:
        """Validate and convert value to ObjectId string."""
        if isinstance(value, ObjectId):
            return str(value)
        if isinstance(value, str):
            try:
                ObjectId(value)
                return value
            except InvalidId:
                raise ValueError(f"Invalid ObjectId format: {value}")
        raise ValueError(f"Cannot convert {type(value)} to ObjectId")


def validate_object_id(value: str) -> ObjectId:
    """
    Validate a string and convert it to ObjectId.
    
    Args:
        value: String representation of ObjectId
        
    Returns:
        ObjectId instance
        
    Raises:
        ValueError: If the string is not a valid ObjectId format
    """
    try:
        return ObjectId(value)
    except InvalidId:
        raise ValueError(f"Invalid ObjectId format: {value}")


def is_valid_object_id(value: str) -> bool:
    """
    Check if a string is a valid ObjectId format.
    
    Args:
        value: String to validate
        
    Returns:
        True if valid ObjectId format, False otherwise
    """
    try:
        ObjectId(value)
        return True
    except (InvalidId, TypeError):
        return False
