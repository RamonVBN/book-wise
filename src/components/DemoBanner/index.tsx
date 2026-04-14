import { X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "../AuthContext"
import { Badge, BannerContainer, BannerContent, CloseButton, DemoBannerButton } from "./styles"


export function DemoBanner() {
  const { demoUser, logout, bannerClosed, handleBanner } = useAuth()
  

  const isDemo = demoUser?.isDemo

  if (!isDemo || !bannerClosed) return null

  return (
    <BannerContainer variant="demo">
      <BannerContent>
        <Badge>DEMO MODE</Badge>
        <span>Dados não são persistidos — ações são simuladas</span>
      </BannerContent>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <DemoBannerButton onClick={logout}>
          Sair do demo
        </DemoBannerButton>

        <CloseButton onClick={handleBanner}>
          <X size={16} />
        </CloseButton>
      </div>
    </BannerContainer>
  )
}