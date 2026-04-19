import { X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "../AuthContext"
import { Badge, BannerContainer, BannerContent, CloseButton, DemoBannerButton } from "./styles"
import { useQueryClient } from "@tanstack/react-query"


export function DemoBanner() {

  const queryClient = useQueryClient()

  const { demoUser, logout, bannerClosed, handleBanner } = useAuth()
  
  const isDemo = demoUser?.isDemo

  if (!isDemo || !bannerClosed) return null

  function handleLogout() {
    queryClient.clear()
    logout()
  }

  return (
    <BannerContainer variant="demo">
      <BannerContent>
        <Badge>DEMO MODE</Badge>
        <span>Dados não são persistidos — ações são simuladas</span>
      </BannerContent>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <DemoBannerButton onClick={handleLogout}>
          Sair do demo
        </DemoBannerButton>

        <CloseButton onClick={handleBanner}>
          <X size={16} />
        </CloseButton>
      </div>
    </BannerContainer>
  )
}