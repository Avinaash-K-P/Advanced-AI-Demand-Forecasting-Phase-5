from pydantic import BaseModel


class InventoryIntegrationCreate(BaseModel):

    system_name: str

    api_url: str

    api_key: str | None = None