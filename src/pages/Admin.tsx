import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Send, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  external_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_document: string;
  total_amount: number;
  status: string;
  created_at: string;
  paid_at: string | null;
  products: unknown;
  utm_params: unknown;
}

const Admin = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingOrderId, setSendingOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-orders", {
        body: { password },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setIsAuthenticated(true);
      setOrders(data.orders || []);
      toast({
        title: "Login realizado",
        description: `${data.orders?.length || 0} pedidos encontrados`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      const isNetwork = /failed to fetch/i.test(message);

      toast({
        title: isNetwork ? "Falha de conexão" : "Erro de autenticação",
        description: isNetwork ? "Não consegui conectar ao servidor do admin." : "Senha incorreta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-orders", {
        body: { password },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      setOrders(data.orders || []);
      toast({
        title: "Pedidos atualizados",
        description: `${data.orders?.length || 0} pedidos encontrados`,
      });
    } catch (error) {
      toast({
        title: "Erro ao buscar pedidos",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendToUtmify = async (orderId: string) => {
    setSendingOrderId(orderId);
    try {
      const { data, error } = await supabase.functions.invoke("admin-orders?action=resend-utmify", {
        body: { orderId, password },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      toast({
        title: "Enviado para UTMify",
        description: data.message || "Pedido reenviado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar para UTMify",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setSendingOrderId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Pago</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelado</Badge>;
      case "refunded":
        return <Badge className="bg-purple-500">Reembolsado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("pt-BR");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Admin - L'Oréal Paris
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Senha de administrador"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button onClick={handleLogin} disabled={loading} className="w-full">
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Administração de Pedidos
          </h1>
          <Button onClick={fetchOrders} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        <div className="grid gap-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                Nenhum pedido encontrado
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(order.status)}
                        <span className="text-sm text-gray-500">
                          ID: {order.external_id}
                        </span>
                        <span className="font-bold text-lg">
                          {formatCurrency(order.total_amount)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>{order.customer_name}</strong>
                        <span className="mx-2">•</span>
                        {order.customer_email}
                        <span className="mx-2">•</span>
                        {order.customer_phone}
                      </div>
                      <div className="text-xs text-gray-400">
                        Criado: {formatDate(order.created_at)}
                        {order.paid_at && (
                          <>
                            <span className="mx-2">•</span>
                            Pago: {formatDate(order.paid_at)}
                          </>
                        )}
                      </div>
                      {order.utm_params && Object.keys(order.utm_params as object).length > 0 && (
                        <div className="text-xs text-blue-600">
                          UTM: {JSON.stringify(order.utm_params)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => resendToUtmify(order.id)}
                        disabled={sendingOrderId === order.id}
                        size="sm"
                        variant="outline"
                        className="whitespace-nowrap"
                      >
                        <Send className={`w-4 h-4 mr-2 ${sendingOrderId === order.id ? "animate-pulse" : ""}`} />
                        {sendingOrderId === order.id ? "Enviando..." : "Enviar UTMify"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Total: {orders.length} pedidos
        </div>
      </div>
    </div>
  );
};

export default Admin;
