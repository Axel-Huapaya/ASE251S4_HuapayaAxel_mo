import { useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { AppInput, ScreenContainer } from "../../components/common";
import { EntityCard, EstadoBadge, EstadoToggle, FormModal, ListHeader } from "../../components/ui";
import { colors } from "../../constants/colors";
import { useUsuarios } from "../../hooks/use-usuarios";
import type { Usuario, UsuarioFormValues, UsuarioPayload } from "../../types";
import { validarUsuario } from "../../utils/validators";

const FORM_VACIO: UsuarioFormValues = {
  nombre: "",
  apellido: "",
  correo: "",
  password: "",
  rol: "OPERADOR",
  fechaNacimiento: "",
  fechaContratacion: "",
};

const ROLES_DISPONIBLES = ["ADMIN", "OPERADOR", "SUPERVISOR", "INGENIERO"];

export default function UsuariosScreen() {
  const { usuarios, cargando, cargar, guardar, eliminar, restaurar } = useUsuarios();
  const [verActivos, setVerActivos] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState<UsuarioFormValues>(FORM_VACIO);
  const [busqueda, setBusqueda] = useState("");

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideEstado = (u.estado ?? true) === verActivos;
    const q = busqueda.trim().toLowerCase();
    if (!q) return coincideEstado;
    const nombreCompleto = `${u.nombre ?? ""} ${u.apellido ?? ""}`.toLowerCase();
    const correo = (u.correo ?? "").toLowerCase();
    const rol = (u.rol ?? "").toLowerCase();
    return coincideEstado && (nombreCompleto.includes(q) || correo.includes(q) || rol.includes(q));
  });

  const campo = <K extends keyof UsuarioFormValues>(k: K, valor: UsuarioFormValues[K]) =>
    setForm((f) => ({ ...f, [k]: valor }));

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  async function refrescar() {
    setRefrescando(true);
    await cargar();
    setRefrescando(false);
  }

  function abrirNuevo() {
    setEditando(null);
    setForm(FORM_VACIO);
    setModalVisible(true);
  }

  function abrirEditar(item: Usuario) {
    setEditando(item);
    setForm({
      nombre: item.nombre ?? "",
      apellido: item.apellido ?? "",
      correo: item.correo ?? "",
      password: "",
      rol: item.rol ?? "OPERADOR",
      fechaNacimiento: item.fechaNacimiento ?? "",
      fechaContratacion: item.fechaContratacion ?? "",
    });
    setModalVisible(true);
  }

  async function onGuardar() {
    const errorValidacion = validarUsuario(form, Boolean(editando));
    if (errorValidacion) {
      Alert.alert("Datos incompletos", errorValidacion);
      return;
    }

    try {
      const payload: UsuarioPayload = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        correo: form.correo.trim(),
        rol: form.rol.trim(),
        fechaNacimiento: form.fechaNacimiento.trim() || undefined,
        fechaContratacion: form.fechaContratacion.trim() || undefined,
      };

      if (form.password.trim()) {
        payload.password = form.password.trim();
      }

      await guardar(payload, editando?.id);
      setModalVisible(false);
    } catch {
      Alert.alert("Error", "No se pudo guardar la información del usuario");
    }
  }

  function onEliminar(item: Usuario) {
    Alert.alert("Desactivar Usuario", `¿Desactivar al usuario "${item.nombre} ${item.apellido}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Desactivar",
        style: "destructive",
        onPress: async () => {
          try {
            await eliminar(item.id);
          } catch {
            Alert.alert("Error", "No se pudo desactivar el usuario");
          }
        },
      },
    ]);
  }

  async function onRestaurar(item: Usuario) {
    try {
      await restaurar(item.id);
    } catch {
      Alert.alert("Error", "No se pudo reactivar el usuario");
    }
  }

  if (cargando) return <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.verdeOscuro} />;

  return (
    <ScreenContainer>
      <View style={styles.filtrosBox}>
        <AppInput
          label="Buscar Usuario"
          placeholder="Buscar por nombre, correo o rol..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      <ListHeader
        titulo="Gestión de Usuarios"
        textoBoton="Nuevo Usuario"
        onPressBoton={abrirNuevo}
      />
      <EstadoToggle verActivos={verActivos} onCambiar={setVerActivos} />

      <FlatList
        data={usuariosFiltrados}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={refrescar} colors={[colors.verdeOscuro]} />}
        renderItem={({ item }) => (
          <EntityCard
            activo={item.estado ?? true}
            onEditar={() => abrirEditar(item)}
            onEliminar={() => onEliminar(item)}
            onRestaurar={() => onRestaurar(item)}
          >
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.nombreUsuario}>{`${item.nombre} ${item.apellido}`}</Text>
                <Text style={styles.correoUsuario}>{item.correo}</Text>
              </View>
              <EstadoBadge activo={item.estado ?? true} />
            </View>
            <View style={styles.cardDetalles}>
              <View style={styles.badgeRol}>
                <Text style={styles.badgeRolText}>🔑 ROL: {item.rol || "N/A"}</Text>
              </View>
              {Boolean(item.fechaContratacion) && (
                <Text style={styles.detalleTexto}>📅 Contratación: {item.fechaContratacion}</Text>
              )}
            </View>
          </EntityCard>
        )}
        ListEmptyComponent={
          <View style={styles.vacioBox}>
            <Text style={styles.vacioTexto}>
              {busqueda
                ? "No se encontraron usuarios con ese filtro."
                : verActivos
                ? "No hay usuarios activos registrados."
                : "No hay usuarios inactivos."}
            </Text>
          </View>
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      />

      <FormModal
        visible={modalVisible}
        titulo={editando ? "Editar Usuario" : "Nuevo Usuario"}
        textoGuardar={editando ? "Guardar Cambios" : "Crear Usuario"}
        onCerrar={() => setModalVisible(false)}
        onGuardar={onGuardar}
      >
        <AppInput label="Nombre *" placeholder="ej. Juan" value={form.nombre} onChangeText={(v) => campo("nombre", v)} />
        <AppInput label="Apellido *" placeholder="ej. Pérez" value={form.apellido} onChangeText={(v) => campo("apellido", v)} />
        <AppInput
          label="Correo Electrónico *"
          placeholder="juan.perez@agropacayales.com"
          value={form.correo}
          onChangeText={(v) => campo("correo", v)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <AppInput
          label={editando ? "Contraseña (dejar en blanco para no cambiar)" : "Contraseña *"}
          placeholder="••••••••"
          value={form.password}
          onChangeText={(v) => campo("password", v)}
          secureTextEntry
        />

        <Text style={styles.labelRol}>Rol en el Sistema *</Text>
        <View style={styles.rolesRow}>
          {ROLES_DISPONIBLES.map((rolItem) => {
            const seleccionado = form.rol === rolItem;
            return (
              <TouchableOpacity
                key={rolItem}
                style={[styles.rolPill, seleccionado && styles.rolPillSeleccionado]}
                onPress={() => campo("rol", rolItem)}
              >
                <Text style={[styles.rolPillText, seleccionado && styles.rolPillTextSeleccionado]}>{rolItem}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <AppInput
          label="Fecha de Nacimiento (YYYY-MM-DD)"
          placeholder="1990-05-15"
          value={form.fechaNacimiento}
          onChangeText={(v) => campo("fechaNacimiento", v)}
        />
        <AppInput
          label="Fecha de Contratación (YYYY-MM-DD)"
          placeholder="2023-01-10"
          value={form.fechaContratacion}
          onChangeText={(v) => campo("fechaContratacion", v)}
        />
      </FormModal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filtrosBox: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  nombreUsuario: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.texto,
  },
  correoUsuario: {
    fontSize: 13,
    color: colors.textoSuave,
    marginTop: 2,
  },
  cardDetalles: {
    marginTop: 4,
    gap: 6,
  },
  badgeRol: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(46,125,50,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeRolText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.verdeOscuro,
  },
  detalleTexto: {
    fontSize: 12,
    color: colors.textoSuave,
  },
  vacioBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  vacioTexto: {
    color: colors.textoSuave,
    fontSize: 14,
    textAlign: "center",
  },
  labelRol: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.texto,
    marginBottom: 8,
    marginTop: 4,
  },
  rolesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  rolPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.inputFondo,
  },
  rolPillSeleccionado: {
    backgroundColor: colors.verdeOscuro,
    borderColor: colors.verdeOscuro,
  },
  rolPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textoSuave,
  },
  rolPillTextSeleccionado: {
    color: colors.blanco,
  },
});
